const { SlashCommandBuilder } = require("discord.js");
const commandTimeout = 3000;
const pino = require("../../../logger");
const { checkGuildLocale } = require("../../models/guilds/locale");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("duck")
		.setNameLocalization("pt-BR", "pato")
		.setDescription("Duck!")
		.setDescriptionLocalization("pt-BR", "Apenas pato.")
		.setDMPermission(false),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction }) => {
		const locales = {
			"pt-BR": "Pato",
			"en-US": "Duck",
		};

		const guildId = interaction.guildId;

		const guildLocale = await checkGuildLocale(guildId);
		let i = 0;
		interaction.reply({ content: locales[guildLocale] });

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
		timeout: commandTimeout,
	},
};
