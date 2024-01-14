const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { query } = require("../../../infra/database");
const commandTimeout = 3000;
const pino = require("../../../logger");
const { subHours, format } = require("date-fns");
module.exports = {
	data: new SlashCommandBuilder().setName("pato").setDescription("pato!").setDMPermission(false),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 * @param {Client} param1
	 */
	run: async ({ interaction, client }) => {
		let i = 0;
		interaction.reply("pato");
		const interval = setInterval(() => {
			interaction.channel.send(":duck:");
			i++;
			if (i === 10) {
				interaction.channel.send("Sabe oq isso significa? Que eu te quero :duck:da vida");
				clearInterval(interval);
			}
		}, 1000);
	},
	options: {
		devOnly: true,
		timeout: commandTimeout,
	},
};
