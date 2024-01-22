const { SlashCommandBuilder, Client } = require("discord.js");
const commandTimeout = 3000;

const { checkGuildLocale } = require("../../models/guilds/locale");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("choose")
		.setNameLocalization("pt-BR", "escolher")
		.setDescription("I will choose something for you!")
		.setDescriptionLocalization("pt-BR", "Eu vou escolher algo pra você")

		.addStringOption((option) =>
			option
				.setName("choices")
				.setNameLocalization("pt-BR", "escolhas")
				.setDescription(
					"Enter the options and I will choose at random (comma separated) Usage: option1, option2, option3",
				)
				.setDescriptionLocalization(
					"pt-BR",
					"Insira as opções que você quer que eu escolha (separada por virgula)! Usage: escolha1,escolha2",
				)
				.setRequired(true),
		),
	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 * @param {Client} param1
	 */
	run: async ({ interaction, client }) => {
		const successLocales = {
			"pt-BR": "Hmmm... eu escolho",
			"en-US": "Hmmm... I choose",
		};

		const errorLocales = {
			"pt-BR": "Você precisa colocar pelomenos 2 escolhas!",
			"en-US": "You need to put at least 2 choices!",
		};

		const locale = await checkGuildLocale(interaction.guildId);

		const rawChoices = interaction.options.getString("choices");

		const choicesArray = rawChoices.split(",");

		const newArray = choicesArray.map((element) => element.trim());

		if (newArray.length <= 1) {
			const errorTranslate = errorLocales[locale];

			interaction.reply(`${errorTranslate}`);
			return true;
		}

		const randomIndex = Math.floor(Math.random() * newArray.length);
		const result = newArray[randomIndex];

		const successTranslate = successLocales[locale];

		interaction.reply(`${successTranslate} ${result}`);
	},
	options: {
		timeout: commandTimeout,
	},
};
