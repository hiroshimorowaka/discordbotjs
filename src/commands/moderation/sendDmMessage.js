const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { checkGuildLocale } = require("../../models/guilds/locale");
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
				.setName("title")
				.setNameLocalization("pt-BR", "titulo")
				.setDescription("The message title (embed)!")
				.setDescriptionLocalization("pt-BR", "O titulo da mensagem (embed)!")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("content")
				.setNameLocalization("pt-BR", "mensagem")
				.setDescription("The message content (embed)! Use '`\n`' to break line")
				.setDescriptionLocalization(
					"pt-BR",
					"O conteudo da mensagem desejada (embed)! Use '`\n`' para pular para a proxima linha",
				)
				.setRequired(true),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		const userSelected = interaction.options.getMember("user");
		const title = interaction.options.getString("title").trim();
		const content = interaction.options.getString("content").trim();
		const guild = interaction.guild;

		const serverlocale = await checkGuildLocale(guild.id);

		const embed = new EmbedBuilder().setTitle(title).setDescription(content);

		const warnLocale = {
			"pt-BR": `> *Olá! A mensagem a seguir foi definida pela equipe de **${guild.name}** (${guild.id}). Se ela está divulgando conteúdos de forma inadequada, possui conteúdo NSFW ou quebra os termos de uso do Discord, por favor, reporte para a equipe do Hiroshi BOT e saia do servidor! Obrigado!!*`,
			"en-US": `> *Hello, the following message has been set by the **${guild.name}** (${guild.id}) team. If it is posting content inappropriately, has NSFW content or breaks Discord's terms of use, please report it to the Hiroshi BOT team and leave the server! Thank you!*`,
		};

		try {
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
		} catch (error) {
			const errorLocales = {
				"pt-BR": "Eu não consigo enviar mensagens para esse usuário!",
				"en-US": "I can't send messages to this user!",
			};
			interaction.reply({
				content: errorLocales[serverlocale] || errorLocales["en-US"],
				ephemeral: true,
			});
			return;
		}
	},
	options: {
		userPermissions: ["BanMembers", "KickMembers", "ModerateMembers"],
		timeout: commandTimeout,
	},
};
