const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Show all commands and their description!")
		.setNameLocalization("pt-BR", "teste"),
	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 * @param {import('discord.js').Client} param1
	 */

	run: async ({ interaction, client }) => {
		const embed = new EmbedBuilder().setTitle("List of all commands!");

		await interaction.deferReply();

		const locale = interaction.locale;

		const commands = await client.application.commands.fetch();

		for (command of commands.values()) {
			embed.addFields({
				name: `/${command.nameLocalizations?.[locale] || command.name}`,
				value: `${command.descriptionLocalizations?.[locale] || command.description}`,
			});
		}
		interaction.editReply({ embeds: [embed] });
	},
	options: {
		timeout: commandTimeout,
	},
};
