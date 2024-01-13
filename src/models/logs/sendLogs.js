const { Client } = require("discord.js");
const { query } = require("../../../infra/database");
const pino = require("../../../logger");
/**
 *
 * @param {Client} channelId
 */

async function sendLogs(interaction) {
	const guildId = interaction.guildId;
	const result = await query("SELECT * FROM logs WHERE guild_id = $1", [
		guildId,
	]);
	const channels = result.rows[0]?.channels;
	if (channels) {
		for (i of channels) {
			const channel = await interaction.guild.channels.fetch(i);
			channel.send(
				`Command **${interaction.commandName}** used by ${interaction.user.tag} ||${interaction.user.id}||`,
			);
		}
		pino.info("Logs sented");
		return;
	}
	pino.info("Logs channels not seted");
}

module.exports = {
	sendLogs,
};
