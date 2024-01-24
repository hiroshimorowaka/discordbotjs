const { checkRolePosition } = require("../../validations/checkRolePosition");
const { query } = require("../../../../infra/database");
const { punish } = require("./punishType");
const pino = require("../../../../logger");
const { EmbedBuilder, Interaction } = require("discord.js");
const { errorEmbed } = require("../../embeds/defaultEmbeds");
const { deleteInfoOnExitGuild } = require("../../guilds/deleteInfoOnExitGuild");
const { checkGuildLocale } = require("../../guilds/locale");
const { checkIfGuildIsConfigurated, checkUserWarns } = require("./commonWarn");
/**
 * @param {Interaction} interaction
 */
async function addWarn(interaction) {
	const userSelectedId = interaction.options.get("user").value;
	let reason = interaction.options.get("reason")?.value;
	const requestUser = interaction.member.id;
	const guildId = interaction.guildId;
	const serverLocale = await checkGuildLocale(guildId);

	const noReasonLocale = {
		"pt-BR": "Não informado.",
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

module.exports = {
	addWarn,
};
