const { checkRolePosition } = require("../../validations/checkRolePosition");
const { query } = require("../../../../infra/database");
const { punish } = require("./punishType");
const pino = require("../../../../logger");
const { EmbedBuilder } = require("discord.js");
const { errorEmbed } = require("../../embeds/defaultEmbeds");
const { deleteInfoOnExitGuild } = require("../../guilds/deleteInfoOnExitGuild");

const { format, subHours } = require("date-fns");

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
	if (!reason) reason = "No Reason Provided";

	await interaction.deferReply({ ephemeral: true });

	const userSelectedObj =
		interaction.guild.members.cache.get(userSelectedId) ||
		(await interaction.guild.members.fetch(userSelectedId).catch(() => {}));

	if (!userSelectedObj) {
		await query("DELETE FROM warns WHERE user_id = $1", [userSelectedId]);

		errorEmbed.setDescription("That user doesn't exist in this server!");

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
			errorEmbed.setDescription(
				"The warn feature is not configured to this server! Please use **/settings warns**!",
			);
			interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}

		await query("INSERT INTO warns (guild_id,user_id,reason,staff) VALUES ($1,$2,$3,$4)", [
			guildId,
			userSelectedId,
			reason,
			requestUser,
		]);

		const userWarnsResult = await checkUserWarns(guildId, userSelectedId);

		const needToPunish = userWarnsResult.count >= userWarnsResult.maxWarns;
		const embed = new EmbedBuilder().setTitle("Member Warned!");

		if (needToPunish) {
			const punishmentType = userWarnsResult.punishment_type;
			const punishment = punish[punishmentType]?.run;

			if (punishment) {
				const punish_message = punishment(userSelectedObj, reason, userWarnsResult.timeout_duration);

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

			userSelectedObj.send(
				`You have been punished on **${interaction.guild.name}** by <@${requestUser}>.\nReason: \`${reason}\`\nYou exceed max warns count!`,
			);
		} else {
			embed.setDescription(
				`${userSelectedObj} has been warned\nThis user has **${userWarnsResult.count}** warns`,
			);

			userSelectedObj.send(
				`You have been warned on **${interaction.guild.name}** by <@${requestUser}>.\nReason: \`${reason}\`\nYou already has **${userWarnsResult.count}** warn(s)`,
			);
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
			const warnEmbed = new EmbedBuilder()
				.setTitle("⚠️ Warning!")
				.setDescription("This user don't have warns to remove!")
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

		if (amount > 1) {
			embed.setDescription(`**${amount}** warns has been removed from ${userSelectedObj}`);
		} else {
			embed.setDescription(`The warn from ${userSelectedObj} has been removed!`);
		}

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
	const embed = new EmbedBuilder().setTitle("List of warns");

	const guildId = interaction.guild.id;
	const description = [];

	await interaction.deferReply();

	const users = await query(
		"SELECT user_id,count(user_id) FROM warns WHERE guild_id = $1 GROUP BY user_id ORDER BY count DESC;",
		[guildId],
	);

	if (users.rowCount === 0) {
		interaction.editReply("Anyone in this guild has warns!");
		return;
	}

	for (i of users.rows) {
		const newString = `<@${i.user_id}>: **${i.count}** warns\n`;
		description.push(newString);
	}

	embed.setDescription(description.join(" "));

	interaction.editReply({ embeds: [embed] });
}
/**
 * @param {import('discord.js').Interaction} interaction
 */
async function listUserWarns(interaction, userSelected) {
	await interaction.deferReply();

	const startTime = performance.now();
	const user = await query("SELECT * FROM warns WHERE guild_id = $1 AND user_id = $2 ORDER BY timestamp", [
		interaction.guildId,
		userSelected.id,
	]);
	const endTime = performance.now();
	if (user.rows.length > 0) {
		const embed = new EmbedBuilder().setTitle(`${userSelected.user.username} warns`);

		for (let i = 0; i < user.rows.length; i++) {
			const date = subHours(user.rows[i].timestamp, 3);
			const newDate = format(date, "dd/MM H:mm:ss");
			embed.addFields({
				name: `Warn ${i + 1} - ${newDate} GMT-3`,
				value: `Staff: <@${user.rows[i].staff}>\nReason: ${user.rows[i].reason}\n`,
			});
		}

		interaction.editReply({
			content: `Perfomance time (Just Database perfomance: ${(endTime - startTime).toFixed(4)}ms)`,
			embeds: [embed],
		});
	} else {
		interaction.editReply("This user doesn't have warns!");
	}
}

module.exports = {
	checkUserWarns,
	addWarn,
	removeWarn,
	listWarn,
	listUserWarns,
};
