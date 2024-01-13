const { SlashCommandBuilder } = require("discord.js");
const { maxWarnCommand } = require("../../models/settings/warn/setMaxWarns");
const { warnPunishmentCommand } = require("../../models/settings/warn/setWarnPunishmentType");

const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Set settings to specified features!")

		.addSubcommandGroup((subCommandGroup) =>
			subCommandGroup
				.setName("warns")
				.setDescription("Settings to warn system!")

				.addSubcommand((subCommand) =>
					subCommand
						.setName("punishment")
						.setDescription("Select the type of punishment the user will recieve after reach warns limit!")

						.addIntegerOption((option) =>
							option
								.setName("type")
								.setDescription("The punish type! (1: Kick, 2: Ban, 3: Timeout)")
								.setRequired(true)
								.addChoices({ name: "Kick", value: 1 }, { name: "Ban", value: 2 }, { name: "Timeout", value: 3 }),
						)

						.addStringOption((option) =>
							option.setName("timeout_duration").setDescription("Timeout duration if you choose Timeout as punish type! (5s, 30m, 1h, 1 day) (Default: 10m)"),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("max")
						.setDescription("The maximum of warns to user has been punished!")

						.addIntegerOption((option) =>
							option.setName("limit").setDescription("Number of warnings that will punish the member when reached (Integer Number)").setMinValue(1).setRequired(true),
						),
				),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction }) => {
		const subCommandGroup = interaction.options.getSubcommandGroup();
		const subCommand = interaction.options.getSubcommand();

		if (subCommandGroup === "warns") {
			await interaction.deferReply();

			if (subCommand === "punishment") {
				await warnPunishmentCommand(interaction);
				return;
			}

			if (subCommand === "max") {
				await maxWarnCommand(interaction);
				return;
			}
		}
	},
	options: {
		userPermissions: ["ManageGuild"],
		timeout: commandTimeout,
	},
};
