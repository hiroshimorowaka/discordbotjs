const { SlashCommandBuilder } = require("discord.js");
const commandTimeout = 1000;
const { query } = require("../../../infra/database");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("teste")
		.setDescription("teste")
		.setDescriptionLocalization("pt-BR", "teste"),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction }) => {
		const time = new Date().toUTCString();
		console.log(time);

		const teste = await query("SELECT * FROM warns;");
		console.log(teste.rows);
		console.log(new Date());
		const teste2 = new Intl.DateTimeFormat("pt-BR", {
			timeZone: "America/Sao_Paulo",
			dateStyle: "short",
			timeStyle: "medium",
		});

		interaction.reply(`${teste2.format(teste.rows[0].timestamp)}\n${teste.rows[0].timestamp}`);
	},
	options: {
		devOnly: true,
		timeout: commandTimeout,
	},
};
