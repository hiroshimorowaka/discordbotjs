const { SlashCommandBuilder } = require("discord.js");

const { registerGuild } = require("../../models/guilds/guildRegistering");
const commandTimeout = 30000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("Setup the BOT to work on your server")
		.setDescriptionLocalization("pt-BR", "Configuração inicial do BOT caso necessário!")
		.setDMPermission(false),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		await interaction.reply("Configuring your server...");

		const result = await registerGuild(interaction.guildId, interaction.client);

		await interaction.editReply("Start setup was made successfully!");
	},
	options: {
		userPermissions: ["ManageGuild"],
		timeout: commandTimeout,
	},
};
