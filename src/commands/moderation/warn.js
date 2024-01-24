const { SlashCommandBuilder } = require("discord.js");
const { removeWarn } = require("../../models/moderation/warn/removeWarn");
const { listUserWarns } = require("../../models/moderation/warn/listUserWarns");
const { listWarn } = require("../../models/moderation/warn/listAllWarns");
const { addWarn } = require("../../models/moderation/warn/addWarn");

const commandTimeout = 3000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("warn")
		.setDescription("Warn a user!")
		.setDescriptionLocalization("pt-BR", "Sistema de advertências para usuários!")
		.addSubcommand((subCommand) =>
			subCommand
				.setName("add")
				.setNameLocalization("pt-BR", "adicionar")
				.setDescription("Add 1 warn to user")
				.setDescriptionLocalization("pt-BR", "Adiciona uma advertência ao usuário!")
				.addUserOption((option) =>
					option
						.setName("user")
						.setNameLocalization("pt-BR", "usuario")
						.setDescription("The target to warn!")
						.setDescriptionLocalization("pt-BR", "o usuário que será advertido!")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("reason")
						.setNameLocalization("pt-BR", "motivo")
						.setDescription("The reason to warn this user! (Will be shown to him)")
						.setDescriptionLocalization(
							"pt-BR",
							"O motivo para advertir esse usuário! (Será mostrado para ele)",
						),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("remove")
				.setDescription("Remove user warn(s)!")
				.setDescriptionLocalization("pt-BR", "Remove advertências do usuário!")

				.addUserOption((option) =>
					option
						.setName("user")
						.setNameLocalization("pt-BR", "usuario")
						.setDescription("The user to remove warn(s)!")
						.setDescriptionLocalization("pt-BR", "O usuário a ter sua advertência removida!")
						.setRequired(true),
				)

				.addIntegerOption((option) =>
					option
						.setName("quantity")
						.setNameLocalization("pt-BR", "quantidade")
						.setDescription("Quantity of warns to remove (Default 1 if not selected)")
						.setDescriptionLocalization(
							"pt-BR",
							"Quantidade de advertências a ser removida (Padrão é 1 caso não informado)",
						),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("list")
				.setDescription("List all server user warns!")
				.setDescriptionLocalization("pt-BR", "Lista todas as advertências do servidor!")
				.addUserOption((option) =>
					option
						.setName("user")
						.setNameLocalization("pt-BR", "usuario")
						.setDescription("Show specific user warn informations!")
						.setDescriptionLocalization("pt-BR", "Mostra informações de warn especificas de um usuário!"),
				),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		const subCommand = interaction.options.getSubcommand();
		const userSelected = interaction.options?.getMember("user");
		if (subCommand === "add") {
			await addWarn(interaction);
			return;
		}
		if (subCommand === "remove") {
			await removeWarn(interaction);
			return;
		}
		if (subCommand === "list") {
			if (userSelected) {
				await listUserWarns(interaction, userSelected);
				return;
			}
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
