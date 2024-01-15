const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const commandTimeout = 3000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("dm")
		.setDescription("Envie uma DM para um usuário!")
		.addUserOption((option) =>
			option.setName("user").setDescription("O usuário que será enviado a DM!").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("text").setDescription("O conteúdo da DM!").setRequired(true),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		const userSelected = interaction.options.getMember("user");
		const text = interaction.options.getString("text");
		const guild = interaction.guild;
		const embed = new EmbedBuilder()

			.setTitle("Uma nova mensagem foi enviada para você!")
			.setDescription(`${text}`);

		await userSelected.send({
			content: `> *Olá! A mensagem a seguir foi definida pela equipe de **${guild.name}** (${guild.id}). Se ela está divulgando conteúdos de forma inadequada, possui conteúdo NSFW ou quebra os termos de uso do Discord, por favor, reporte para a equipe do Hiroshi BOT e saia do servidor! Obrigado!!*`,
			embeds: [embed],
		});
		await interaction.reply({
			content: "Mensagem enviada!",
			ephemeral: true,
		});
	},
	options: {
		userPermissions: ["BanMembers", "KickMembers", "ModerateMembers"],
		timeout: commandTimeout,
	},
};
