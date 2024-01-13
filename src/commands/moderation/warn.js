const { SlashCommandBuilder } = require("discord.js");
const {
	addWarn,
	removeWarn,
	listWarn,
} = require("../../models/moderation/warn/warn");

const commandTimeout = 3000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("warn")
		.setDescription("Warn a user!!!")
		.addSubcommand((subCommand) =>
			subCommand
				.setName("add")
				.setDescription("Add 1 warn to user")
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("The target to warn!")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("reason")
						.setDescription("The reason to warn this user!"),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("remove")
				.setDescription("Remove user warn(s)!")

				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("The user to remove warn(s)!")
						.setRequired(true),
				)

				.addIntegerOption((option) =>
					option
						.setName("quantity")
						.setDescription(
							"Quantity of warns to remove (Default 1 if not selected)",
						),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand.setName("list").setDescription("List all server user warns!"),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		const subCommand = interaction.options.getSubcommand();

		if (subCommand === "add") {
			await addWarn(interaction);
			return;
		}
		if (subCommand === "remove") {
			await removeWarn(interaction);
			return;
		}
		if (subCommand === "list") {
			await listWarn(interaction);
			return;
		}
	},
	options: {
		userPermissions: ["BanMembers", "KickMembers", "ModerateMembers"],
		botPermissions: ["BanMembers", "KickMembers", "ModerateMembers"],
		timeout: commandTimeout,
	},
};
