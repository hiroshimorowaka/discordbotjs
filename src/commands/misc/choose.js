const { SlashCommandBuilder } = require("discord.js");
const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("choose")
		.setDescription("I will choose something for you!")
		.addStringOption((option) =>
			option.setName("choices").setDescription("Enter the options and I will choose at random Usage: option1, option2 blabla, option3").setRequired(true),
		),
	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction }) => {
		const rawChoices = interaction.options.getString("choices");

		const choicesArray = rawChoices.split(",");

		const newArray = choicesArray.map((element) => element.trim());

		const randomIndex = Math.floor(Math.random() * newArray.length);
		const result = newArray[randomIndex];

		interaction.reply(`Hmmm...I choose \`${result}\` `);
	},
	options: {
		timeout: commandTimeout,
	},
};
