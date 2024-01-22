const { SlashCommandBuilder } = require("discord.js");
const {
	removeBlacklistWord,
	addBlacklistWord,
	listBlacklistWords,
} = require("../../models/moderation/blacklist/blacklist");

const commandTimeout = 2000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("blacklist")
		.setDescription("Blacklist settings!")
		.setDescriptionLocalization("pt-BR", "Configuração da blacklist!")
		.setDMPermission(false)
		.addSubcommandGroup((subcommandgroup) =>
			subcommandgroup
				.setName("words")
				.setNameLocalization("pt-BR", "palavras")
				.setDescription("Blacklist words config")
				.setDescriptionLocalization("pt-BR", "Configura as palavras da blacklist")
				.addSubcommand((subCommand) =>
					subCommand
						.setName("add")
						.setDescription("Add a new blacklist word")
						.setDescriptionLocalization("pt-BR", "Adiciona palavras a blacklist")
						.addStringOption((option) =>
							option
								.setName("word")
								.setNameLocalization("pt-BR", "palavra")
								.setDescription("The word(s) you want to blacklist Usage: word1,word2,word3")
								.setDescriptionLocalization(
									"pt-BR",
									"A(s) palavra(s) que você deseja adicionar! Usage: palavra1,palavra2",
								)
								.setRequired(true),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("remove")
						.setDescription("Remove blacklist word(s)")
						.setDescriptionLocalization("pt-BR", "Remove palavras da blacklist!")
						.addStringOption((option) =>
							option
								.setName("word")
								.setName("palavra")
								.setDescription("The word(s) you want to remove from blacklist! Usage: word1,word2,word3")
								.setDescriptionLocalization(
									"pt-BR",
									"A(s) palavra(s) que você deseja retirar da blacklist! Usage: word1,word2",
								)
								.setRequired(true),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("list")
						.setDescription("List words blacklisted")
						.setDescriptionLocalization("pt-BR", "Lista todas as palavras banidas do servidor!"),
				),
		),
	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 * @param {import('commandkit').SlashCommandProps} param1
	 */
	run: async ({ interaction, client }) => {
		const subCommand = interaction.options.getSubcommand();
		const subCommandGroup = interaction.options.getSubcommandGroup();
		if (subCommandGroup === "words") {
			if (subCommand === "list") {
				await listBlacklistWords(interaction, client);
				return;
			}
			if (subCommand === "add") {
				await addBlacklistWord(interaction, client);
				return;
			}
			if (subCommand === "remove") {
				await removeBlacklistWord(interaction, client);
				return;
			}
		}
	},

	options: {
		userPermissions: ["ManageGuild"],
		timeout: commandTimeout,
	},
};
