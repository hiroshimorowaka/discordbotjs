const { SlashCommandBuilder } = require("discord.js");

const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bot")
		.setDescription("Bot configs!")
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
								.setDescription("Do you wanna reload global commands or just test server commands?")
								.setRequired(true),
						),
				),
		)

		.addSubcommand((subCommand) => subCommand.setName("guilds").setDescription("Show guilds count")),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction, client, handler }) => {
		const subCommand = interaction.options.getSubcommand();

		await interaction.deferReply();

		if (subCommand === "reload") {
			const global = interaction.options.get("global").value;

			global ? await handler.reloadCommands() : await handler.reloadCommands("dev");

			interaction.followUp("Reloaded!");
			return;
		}

		if (subCommand === "guilds") {
			const guildCount = client.guilds.cache.get() || (await client.guilds.fetch());
			interaction.editReply(`I'm in **${guildCount.size}** servers`);
		}
	},
	options: {
		devOnly: true,
		timeout: commandTimeout,
	},
};
