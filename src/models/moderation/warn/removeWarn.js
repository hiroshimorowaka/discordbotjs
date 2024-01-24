const { checkRolePosition } = require("../../validations/checkRolePosition");
const { query } = require("../../../../infra/database");
const pino = require("../../../../logger");
const { EmbedBuilder, Interaction } = require("discord.js");
const { warnEmbed } = require("../../embeds/defaultEmbeds");
const { checkGuildLocale } = require("../../guilds/locale");
const { checkUserWarns } = require("./commonWarn");

/**
 * @param {Interaction} interaction
 * @returns
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

			warnEmbed.setDescription(dontHaveWarnsLocales[serverLocale] || dontHaveWarnsLocales["en-US"]);

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

module.exports = {
	removeWarn,
};
