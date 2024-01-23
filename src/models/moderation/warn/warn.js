const { checkRolePosition } = require("../../validations/checkRolePosition");
const { query } = require("../../../../infra/database");
const { punish } = require("./punishType");
const pino = require("../../../../logger");
const { EmbedBuilder } = require("discord.js");
const { errorEmbed } = require("../../embeds/defaultEmbeds");
const { deleteInfoOnExitGuild } = require("../../guilds/deleteInfoOnExitGuild");
const { checkGuildLocale } = require("../../guilds/locale");
const { checkTimezone } = require("../../settings/timezones");

/**
 * @param {import('discord.js').Interaction} interaction
 */

async function checkIfGuildIsConfigurated(guild_id) {
	const maxWarnsConfig = await query("SELECT * FROM warn_config WHERE guild_id = $1", [guild_id]);
	const maxWarns = maxWarnsConfig.rows[0]?.max_warns;
	const punishment_type = maxWarnsConfig.rows[0]?.punishment_type;

	if (!maxWarns || !punishment_type || punishment_type === 0) {
		return false;
	}

	return true;
}

async function checkUserWarns(guild_id, user_id) {
	const result = await query("SELECT * FROM warns WHERE guild_id = $1 AND user_id = $2", [guild_id, user_id]);

	const maxWarnsConfig = await query("SELECT * FROM warn_config WHERE guild_id = $1", [guild_id]);
	const maxWarns = maxWarnsConfig.rows[0]?.max_warns;
	const punishment_type = maxWarnsConfig.rows[0]?.punishment_type;
	const timeout_duration = maxWarnsConfig.rows[0]?.timeout_duration || 0;
	const count = result.rowCount;

	return { count, maxWarns, punishment_type, timeout_duration };
}
/**
 * @param {import('discord.js').Interaction} interaction
 */
async function addWarn(interaction) {
	const userSelectedId = interaction.options.get("user").value;
	let reason = interaction.options.get("reason")?.value;
	const requestUser = interaction.member.id;
	const guildId = interaction.guildId;
	const serverLocale = await checkGuildLocale(guildId);

	const noReasonLocale = {
		"pt-BR": "Motivo não informado.",
		"en-US": "No reason provided.",
	};

	if (!reason) reason = noReasonLocale[serverLocale] || noReasonLocale["en-US"];

	await interaction.deferReply({ ephemeral: true });

	const userSelectedObj =
		interaction.guild.members.cache.get(userSelectedId) ||
		(await interaction.guild.members.fetch(userSelectedId).catch(() => {}));

	if (!userSelectedObj) {
		await query("DELETE FROM warns WHERE user_id = $1", [userSelectedId]);

		const noUserLocale = {
			"pt-BR": "Esse usuário não existe nesse servidor!",
			"en-US": "That user doesn't exist in this server!",
		};

		errorEmbed.setDescription(noUserLocale[serverLocale] || noReasonLocale["en-US"]);

		await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
		return false;
	}

	const checkRole = await checkRolePosition(interaction, userSelectedObj, "warn");

	if (!checkRole) {
		return false;
	}

	try {
		const checkGuild = await checkIfGuildIsConfigurated(guildId);

		if (!checkGuild) {
			const warnNoConfiguredLocale = {
				"pt-BR":
					"A função de warn não está configurada nesse servidor! Por favor use **/configuracoes warns**",
				"en-US": "The warn feature is not configured to this server! Please use **/settings warns**!",
			};

			errorEmbed.setDescription(warnNoConfiguredLocale[serverLocale] || warnNoConfiguredLocale["en-US"]);
			interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}

		const isAdministrator = userSelectedObj.permissions.has("Administrator", true);

		if (isAdministrator) {
			const userIsAdminLocales = {
				"pt-BR": "Eu não posso dar warn em um Administrator!",
				"en-US": "I can't warn administrators!",
			};

			errorEmbed.setDescription(userIsAdminLocales[serverLocale] || userIsAdminLocales["en-US"]);
			interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return false;
		}

		const date = new Date();
		await query("INSERT INTO warns (guild_id,user_id,reason,staff,timestamp) VALUES ($1,$2,$3,$4,$5)", [
			guildId,
			userSelectedId,
			reason,
			requestUser,
			date,
		]);

		const userWarnsResult = await checkUserWarns(guildId, userSelectedId);

		const needToPunish = userWarnsResult.count >= userWarnsResult.maxWarns;
		const embed = new EmbedBuilder().setTitle("Member Warned!");

		if (needToPunish) {
			const punishmentType = userWarnsResult.punishment_type;
			const punishment = punish[punishmentType]?.run;

			if (punishment) {
				const punish_message = await punishment(
					userSelectedObj,
					reason,
					userWarnsResult.timeout_duration,
					serverLocale,
				).catch((e) => {
					pino.error(e);
					interaction.editReply("This user have 'Administrator' permission and cannot be punished!");
					return false;
				});

				if (punish[punishmentType].name === "kick" || punish[punishmentType].name === "ban") {
					deleteInfoOnExitGuild(guildId, userSelectedId);
				}

				embed.setDescription(`${punish_message}`);
			} else {
				pino.error("Error when punish member, this method does not exists (punish type)");
				errorEmbed.setDescription("Error when try to punish member (method do not exists)!");
				interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
				return;
			}

			const dmUserPunishLocales = {
				"pt-BR": `Você foi punido em **${interaction.guild.name}** por <@${requestUser}>.\nMotivo: \`${reason}\`\nVocê excedeu a quantidade maxima de warns!`,
				"en-US": `You have been punished on **${interaction.guild.name}** by <@${requestUser}>.\nReason: \`${reason}\`\nYou exceed max warns count!`,
			};

			userSelectedObj.send(dmUserPunishLocales[serverLocale] || dmUserPunishLocales["en-US"]);
		} else {
			const successWarn = {
				"pt-BR": `O usuário ${userSelectedObj} foi advertido!\nEsse usuário já tem **${userWarnsResult.count}** advertencia(s)`,
				"en-US": `${userSelectedObj} has been warned\nThis user has **${userWarnsResult.count}** warn(s)`,
			};

			const dmUserNotPunishedLocales = {
				"pt-BR": `Você foi advertido em **${interaction.guild.name}** por <@${requestUser}>.\nMotivo: \`${reason}\`\nVocê já tem **${userWarnsResult.count}** advertencia(s)!`,
				"en-US": `You have been warned on **${interaction.guild.name}** by <@${requestUser}>.\nReason: \`${reason}\`\nYou already has **${userWarnsResult.count}** warn(s)`,
			};

			embed.setDescription(successWarn[serverLocale] || successWarn["en-US"]);

			userSelectedObj.send(dmUserNotPunishedLocales[serverLocale] || dmUserNotPunishedLocales["en-US"]);
		}

		interaction.editReply({ embeds: [embed] });

		// const channelToSend = interaction.guild.channels.cache.get("1193387277548789790") || (await interaction.guild.channels.fetch("1193387277548789790"));

		// channelToSend.send({ embeds: [embed] });
	} catch (e) {
		errorEmbed.setDescription("An error ocurred when executing this command!");
		interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
		pino.error(e);
	}
}
/**
 * @param {import('discord.js').Interaction} interaction
 */
async function removeWarn(interaction) {
	const userSelectedId = interaction.options.get("user").value;
	const guildId = interaction.guildId;
	const serverLocale = await checkGuildLocale(interaction.guild.id);
	let amount = interaction.options.get("quantity")?.value;

	await interaction.deferReply();

	const userSelectedObj =
		interaction.guild.members.cache.get(userSelectedId) ||
		(await interaction.guild.members.fetch(userSelectedId));

	if (!userSelectedObj) {
		await query("DELETE FROM warns WHERE user_id = $1", [userSelectedId]);
		return false;
	}

	const checkRole = await checkRolePosition(interaction, userSelectedObj, "warn");
	if (!checkRole) {
		return false;
	}

	try {
		const userWarnsResult = await checkUserWarns(guildId, userSelectedId);

		if (!userWarnsResult?.count) {
			const dontHaveWarnsLocales = {
				"pt-BR": "Esse usuário não tem avisos para remover!",
				"en-US": "This user has no warnings to remove!",
			};

			const warnEmbed = new EmbedBuilder()
				.setTitle("⚠️ Warning!")
				.setDescription(dontHaveWarnsLocales[serverLocale] || dontHaveWarnsLocales["en-US"])
				.setColor(14397952);

			interaction.editReply({ embeds: [warnEmbed], ephemeral: true });
			return false;
		}

		if (amount > userWarnsResult.count) amount = userWarnsResult.count;

		if (!amount) amount = 1;

		await query(
			"DELETE FROM warns WHERE ctid IN (SELECT ctid FROM warns WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2);",
			[userSelectedId, amount],
		);

		const embed = new EmbedBuilder().setTitle("Warn Removed!");

		const warnRemoveLocales = {
			"pt-BR": `**${amount}** advertencia(s) foram removidas do usuário ${userSelectedObj}`,
			"en-US": `**${amount}** warn(s) has been removed from ${userSelectedObj}`,
		};

		embed.setDescription(warnRemoveLocales[serverLocale] || warnRemoveLocales["en-US"]);

		interaction.editReply({ embeds: [embed] });
	} catch (e) {
		interaction.editReply("An error ocurred when executing this command!");
		pino.error(e);
	}
}

/**
 * @param {import('discord.js').Interaction} interaction
 */

async function listWarn(interaction) {
	const serverLocale = await checkGuildLocale(interaction.guild.id);

	const listTitleLocales = {
		"pt-BR": "Lista de advertências",
		"en-US": "List of warns",
	};

	const embed = new EmbedBuilder().setTitle(listTitleLocales[serverLocale]);

	const guildId = interaction.guild.id;
	const description = [];

	await interaction.deferReply();

	const users = await query(
		"SELECT user_id,count(user_id) FROM warns WHERE guild_id = $1 GROUP BY user_id ORDER BY count DESC;",
		[guildId],
	);

	if (users.rowCount === 0) {
		const noWarnsLocales = {
			"pt-BR": "Ninguém nesse servidor tem advertências!",
			"en-US": "No one on this server has warnings!",
		};

		interaction.editReply(noWarnsLocales[serverLocale] || noWarnsLocales["en-US"]);
		return;
	}

	const warnCountLocales = {
		"pt-BR": "advertência(s)",
		"en-US": "warn(s)",
	};

	for (i of users.rows) {
		const newString = `<@${i.user_id}>: **${i.count}** ${
			warnCountLocales[serverLocale] || warnCountLocales["en-US"]
		}\n`;
		description.push(newString);
	}

	embed.setDescription(description.join(" "));

	interaction.editReply({ embeds: [embed] });
}
/**
 * @param {import('discord.js').Interaction} interaction
 */
async function listUserWarns(interaction, userSelected) {
	const serverLocale = await checkGuildLocale(interaction.guild.id);

	await interaction.deferReply();

	const startTime = performance.now();

	const user = await query("SELECT * FROM warns WHERE guild_id = $1 AND user_id = $2 ORDER BY timestamp", [
		interaction.guildId,
		userSelected.id,
	]);
	const endTime = performance.now();

	if (user.rows.length > 0) {
		const userWarnsTitleLocales = {
			"pt-BR": `Advertências de ${userSelected.user.username}`,
			"en-US": `${userSelected.user.username} warns`,
		};

		const embed = new EmbedBuilder().setTitle(
			userWarnsTitleLocales[serverLocale] || userWarnsTitleLocales["en-US"],
		);

		const fieldNameLocales = {
			"pt-BR": "Advertência",
			"en-US": "Warn",
		};

		const fieldReasonLocales = {
			"pt-BR": "Motivo",
			"en-US": "Reason",
		};

		const timezone = await checkTimezone(interaction.guildId);

		const newDate = new Intl.DateTimeFormat("pt-BR", {
			timeZone: timezone,
			dateStyle: "short",
			timeStyle: "medium",
		});

		for (let i = 0; i < user.rows.length; i++) {
			const date = user.rows[i].timestamp;
			embed.addFields({
				name: `${fieldNameLocales[serverLocale] || fieldNameLocales["en-US"]} ${i + 1} - ${newDate.format(
					date,
				)}`,
				value: `Staff: <@${user.rows[i].staff}>\n${
					fieldReasonLocales[serverLocale] || fieldReasonLocales["en-US"]
				}: ${user.rows[i].reason}\n`,
			});
		}

		if (process.env.DEBUG) {
			interaction.editReply({
				content: `Perfomance time (Just Database perfomance: ${(endTime - startTime).toFixed(2)}ms)`,
				embeds: [embed],
			});
		} else {
			interaction.editReply({
				embeds: [embed],
			});
		}
	} else {
		const userDontHaveWarnsLocales = {
			"pt-BR": "Esse usuário não tem advertências!",
			"en-US": "This user doesn't have warns!",
		};
		interaction.editReply(userDontHaveWarnsLocales[serverLocale] || userDontHaveWarnsLocales["en-US"]);
	}
}

module.exports = {
	checkUserWarns,
	addWarn,
	removeWarn,
	listWarn,
	listUserWarns,
};
