const { SlashCommandBuilder } = require("discord.js");
const {
	removeBlacklistWord,
	addBlacklistWord,
	listBlacklistWords,
} = require("../../models/blacklist/blacklist");

const commandTimeout = 2000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("blacklist")
		.setDescription("Blacklist settings!")
		.setDMPermission(false)
		.addSubcommandGroup((subcommandgroup) =>
			subcommandgroup
				.setName("words")
				.setDescription("Blacklist words from chat")
				.addSubcommand((subCommand) =>
					subCommand
						.setName("add")
						.setDescription("Add a new blacklist word")
						.addStringOption((option) =>
							option
								.setName("word")
								.setDescription("The word you want to block from channels")
								.setRequired(true),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("remove")
						.setDescription("remove a new blacklist word")
						.addStringOption((option) =>
							option
								.setName("word")
								.setDescription("The word you want to block from channels")
								.setRequired(true),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand.setName("list").setDescription("List words blacklisted"),
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
        return
			}
			if (subCommand === "add") {
				await addBlacklistWord(interaction, client);
        return
			}
			if (subCommand === "remove") {
				await removeBlacklistWord(interaction, client);
        return
			}
		}
	},

	options: {
		userPermissions: ["ManageGuild"],
		timeout: commandTimeout,
	},
};
