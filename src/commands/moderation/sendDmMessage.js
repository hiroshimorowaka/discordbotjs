const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const commandTimeout = 3000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("dm")
		.setDescription("Send a staff DM to selected user!")
		.setDescriptionLocalization("pt-BR", "Envia uma DM da staff para algum usuário!")
		.addUserOption((option) =>
			option
				.setName("user")
				.setNameLocalization("pt-BR", "usuario")
				.setDescription("Select the user you want to send a DM!")
				.setDescriptionLocalization("pt-BR", "Selecione o usuário que deseja enviar a mensagem!")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("text")
				.setNameLocalization("pt-BR", "mensagem")
				.setDescription("The DM message!")
				.setDescriptionLocalization("pt-BR", "A mensagem desejada!")
				.setRequired(true),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		const userSelected = interaction.options.getMember("user");
		const text = interaction.options.getString("text");
		const guild = interaction.guild;
		const embed = new EmbedBuilder();
		const serverlocale = interaction.guild.preferredLocale;

		const titleLocales = {
			"pt-BR": "Uma nova mensagem foi enviada para você!",
			"en-US": "A new message has been sent to you!",
		}
			.setTitle(titleLocales[serverlocale] || titleLocales["en-US"])
			.setDescription(`${text}`);

		const warnLocale = {
			"pt-BR": `> *Olá! A mensagem a seguir foi definida pela equipe de **${guild.name}** (${guild.id}). Se ela está divulgando conteúdos de forma inadequada, possui conteúdo NSFW ou quebra os termos de uso do Discord, por favor, reporte para a equipe do Hiroshi BOT e saia do servidor! Obrigado!!*`,
			"en-US": `> *Hello, the following message has been set by the **${guild.name}** (${guild.id}) team. If it is posting content inappropriately, has NSFW content or breaks Discord's terms of use, please report it to the Hiroshi BOT team and leave the server! Thank you!*`,
		};

		await userSelected.send({
			content: warnLocale[serverlocale] || warnLocale["en-US"],
			embeds: [embed],
		});

		const successLocales = {
			"pt-BR": "Mensagem enviada com sucesso!",
			"en-US": "Message sent successfully!",
		};
		await interaction.reply({
			content: successLocales[serverlocale] || successLocales["en-US"],
			ephemeral: true,
		});
	},
	options: {
		userPermissions: ["BanMembers", "KickMembers", "ModerateMembers"],
		timeout: commandTimeout,
	},
};
