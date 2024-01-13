const { SlashCommandBuilder } = require("discord.js");

const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bot")
		.setDescription("Reply Pong foda demais!")
		.addSubcommandGroup((subCommand) =>
			subCommand
				.setName("reload")
				.setDescription("Reload bot features")
				.addSubcommand((subCommand) =>
					subCommand
						.setName("commands")
						.setDescription("Reload discord commands")
						.addBooleanOption((option) =>
							option
								.setName("global")
								.setDescription(
									"Do you wanna reload global commands or just test server commands?",
								)
								.setRequired(true),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("events")
						.setDescription("Reload bot event listeners"),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("validations")
						.setDescription("Reload bot commmands validations"),
				),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction, _, handler }) => {
		await interaction.deferReply();

		const global = interaction.options.get("global").value;

		global
			? await handler.reloadCommands()
			: await handler.reloadCommands("dev");

		interaction.followUp("Reloaded!");
	},
	options: {
		devOnly: true,
		timeout: commandTimeout,
	},
};
