const { SlashCommandBuilder } = require("discord.js");

const { setTimeout, removeTimeout } = require("../../models/moderation/timeout/mTimeout");

const commandTimeout = 3000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Timeout a user.")
		.setDescriptionLocalization("pt-BR", "Da timeout em um usuário!")
		.setDMPermission(false)

		.addSubcommand((subCommand) =>
			subCommand
				.setName("set")
				.setDescription("Set timeout for a user!")
				.setDescriptionLocalization("pt-BR", "Seta um timeout para o usuário!")
				.addUserOption((option) =>
					option
						.setName("user")
						.setNameLocalization("pt-BR", "usuario")
						.setDescription("The user to be timed out")
						.setDescriptionLocalization("pt-BR", "O usuário que será setado o timeout!")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("duration")
						.setNameLocalization("pt-BR", "duracao")

						.setDescription("The duration of time out Usage: (5s, 30m, 1h, 1 day)")
						.setDescriptionLocalization("pt-BR", "A duração do timeout Usage: (5s,30m,1h,1 day)")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("reason")
						.setNameLocalization("pt-BR", "motivo")
						.setDescription("The reason for the time out!")
						.setDescriptionLocalization("O motivo para essa pessoa tomar timeout!"),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("remove")

				.setDescription("Remove user timeout!")
				.setDescriptionLocalization("pt-BR", "Remove o timeout de um usuário!")
				.addUserOption((option) =>
					option
						.setName("user")
						.setNameLocalization("pt-BR", "usuario")

						.setDescription("The user to remove timeout")
						.setDescriptionLocalization("pt-BR", "O usuário que será removido o timeout!")
						.setRequired(true),
				),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction }) => {
		const subCommand = interaction.options.getSubcommand();

		if (subCommand === "set") {
			await setTimeout(interaction);
			return;
		}

		if (subCommand === "remove") {
			await removeTimeout(interaction);
			return;
		}
	},
	options: {
		userPermissions: ["MuteMembers"],
		botPermissions: ["MuteMembers"],
		timeout: commandTimeout,
	},
};
