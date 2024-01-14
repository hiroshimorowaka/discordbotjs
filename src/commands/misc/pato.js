const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { query } = require("../../../infra/database");
const commandTimeout = 3000;
const pino = require("../../../logger");
const { subHours, format } = require("date-fns");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("pato")
		.setNameLocalizations({
			"pt-BR": "pato",
			"en-US": "duck",
		})
		.setDescription("pato!")
		.setDescriptionLocalizations({
			"pt-BR": "Apenas pato.",
			"en-US": "Just duck!",
		})
		.setDMPermission(false),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 * @param {Client} param1
	 */
	run: async ({ interaction, client }) => {
		const locales = {
			"pt-BR": "Pato",
			"en-US": "Duck",
		};

		let i = 0;
		interaction.reply({ content: locales[interaction.locale] });
		console.log(interaction.guild.preferredLocale);
		const messages = [];
		const interval = setInterval(async () => {
			const message = await interaction.channel.send(":duck:");
			messages.push(message);
			i++;

			if (i === 10) {
				messages.push(
					await interaction.channel.send("Sabe oq isso significa? Que eu te quero :duck:da vida"),
				);
				clearInterval(interval);

				setTimeout(() => {
					interaction.channel.bulkDelete(messages);
					interaction.deleteReply();
				}, 5000);
			}
		}, 1000);
	},
	options: {
		devOnly: true,
		timeout: commandTimeout,
	},
};
