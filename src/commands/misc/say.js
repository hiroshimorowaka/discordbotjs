const { SlashCommandBuilder } = require("discord.js");
const commandTimeout = 3000;
const { sendBotCommandLog } = require("../../models/logs/bot/botCommandsLog");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("I will say what you want!")
		.addStringOption((option) =>
			option.setName("text").setDescription("Enter the text and I will say it").setRequired(true),
		),
	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction, client }) => {
		const text = interaction.options.get("text");
		interaction.reply(`${text.value}`);
	},
	options: {
		timeout: commandTimeout,
	},
};
