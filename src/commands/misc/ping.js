const { SlashCommandBuilder, Client } = require("discord.js");
const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Show bot ping!")
		.setDescriptionLocalization("pt-BR", "Mostra o ping do bot!"),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 * @param {Client} param1
	 */
	run: async ({ interaction, client }) => {
		const sent = await interaction.reply({
			content: "Pinging...",
			fetchReply: true,
		});

		await interaction.editReply({
			content: `API Latency: ${client.ws.ping}\nBot Latency: ${
				sent.createdTimestamp - interaction.createdTimestamp
			}ms`,
		});

		setTimeout(() => {
			interaction.deleteReply().catch(() => {});
		}, 5000);
	},
	options: {
		timeout: commandTimeout,
	},
};
