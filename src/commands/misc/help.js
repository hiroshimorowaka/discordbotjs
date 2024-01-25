const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setNameLocalization("pt-BR", "ajuda")
		.setDescription("Show all commands and their description!")
		.setDescriptionLocalization("pt-BR", "Mostra todos todos os comandos e suas descrições!"),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		await interaction.deferReply();

		const locale = interaction.locale;

		const locales = {
			"pt-BR": "Lista de todos os comandos!",
			"en-US": "List of all commands!",
		};
		const embed = new EmbedBuilder().setTitle(locales[locale] || locales["en-US"]);

		const commands =
			interaction.client.application.commands.cache.get() ||
			(await interaction.client.application.commands.fetch());

		for (command of commands.values()) {
			embed.addFields({
				name: `/${command.nameLocalizations?.[locale] || command.name}`,
				value: `${command.descriptionLocalizations?.[locale] || command.description}`,
			});
		}

		interaction.editReply({ embeds: [embed], ephemeral: true });
	},
	options: {
		timeout: commandTimeout,
	},
};
