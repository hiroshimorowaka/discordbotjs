const { SlashCommandBuilder } = require("discord.js");
const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Show bot ping!"),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction }) => {
		const sent = await interaction.reply({
			content: "Pinging...",
			fetchReply: true,
		});

		interaction.editReply(`Bot Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
	options: {
		timeout: commandTimeout,
	},
};
