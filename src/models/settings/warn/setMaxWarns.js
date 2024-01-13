const pino = require("../../../../logger");
const { EmbedBuilder } = require("discord.js");
const { query } = require("../../../../infra/database");
const { checkGuildRegister } = require("./common");
const { errorEmbed } = require("../../embeds/defaultEmbeds");

async function setMaxWarnsSettings(guild_id, max_warns) {
	await query("UPDATE warn_config SET max_warns = $2 WHERE guild_id = $1", [guild_id, max_warns]);
	return true;
}

/**
 * @param {import('discord.js').Interaction} interaction
 */
async function maxWarnCommand(interaction) {
	const guildId = interaction.guildId;
	const maxWarnLimit = interaction.options.get("limit").value;

	try {
		const result = await checkGuildRegister(guildId);

		if (!result) {
			errorEmbed.setDescription("Your guild is not registered, please use /setup to register this guild and try again!");
			await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}

		await setMaxWarnsSettings(guildId, maxWarnLimit);

		const success = new EmbedBuilder().setTitle("Warn max limit set successfully!").setDescription(`You set Warn max limit to: \`${maxWarnLimit}\``);

		interaction.editReply({ embeds: [success] });
	} catch (error) {
		pino.error(error);
		errorEmbed.setDescription("An error ocurred when executing this command. Please try again later!");
		interaction.editReply({ embeds: [errorEmbed] });
		return false;
	}
}

module.exports = {
	maxWarnCommand,
};
