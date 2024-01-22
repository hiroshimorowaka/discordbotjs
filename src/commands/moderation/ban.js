const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getBanConfig } = require("../../models/settings/ban/banConfig");
const { checkRolePosition } = require("../../models/validations/checkRolePosition");
const { errorEmbed } = require("../../models/embeds/defaultEmbeds");

const pino = require("../../../logger");

const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban user!")
		.setDescriptionLocalization("pt-BR", "Bane um usuário!")
		.setDMPermission(false)

		.addUserOption((option) =>
			option
				.setName("user")
				.setNameLocalization("pt-BR", "usuario")
				.setDescription("The user to be banned!")
				.setDescriptionLocalization("pt-BR", "O usuário a ser banido!")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setNameLocalization("pt-BR", "motivo")

				.setDescription("The reason to this user has been banned!")
				.setDescriptionLocalization("pt-BR", "O motivo para esse usuário ser banido!"),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */
	run: async ({ interaction }) => {
		const userId = interaction.options.get("user").value;
		const reason = interaction.options?.getString("reason") || "No reason provided!";
		const guildId = interaction.guildId;
		const staff = interaction.user.username;
		const guildLocale = interaction.guild.preferredLocale;

		await interaction.deferReply({ ephemeral: true });

		const userObj =
			interaction.guild.members.cache.get(userId) ||
			(await interaction.guild.members.fetch(userId).catch(() => {}));

		if (!userObj) {
			errorEmbed.setDescription("That user doesn't exist in this server!");

			await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return false;
		}

		const checkRole = await checkRolePosition(interaction, userObj, "ban");

		if (!checkRole) {
			return false;
		}

		try {
			const userDmLocales = {
				"pt-BR": `Você foi banido da guilda **${interaction.guild.name}** \`(${guildId})\`\nMotivo: \`${reason}\``,
				"en-US": `You have been banned from guild **${interaction.guild.name}** \`(${guildId})\`\nReason: \`${reason}\``,
			};

			userObj.send(userDmLocales[guildLocale]).catch((e) => {
				pino.error(e);
			});

			userObj.ban({ reason: `Staff: ${staff} | Reason: ${reason}` });

			const banConfig = await getBanConfig(guildId);

			if (banConfig?.announce) {
				if (banConfig.announce === 1) {
					const channelId = banConfig.announce_channel;

					const channelObj =
						interaction.guild.channels.cache.get(channelId) ||
						(await interaction.guild.channels.fetch(channelId));

					const emebedTitle = String(banConfig?.announce_embed_title || "The user {user} has been banned!")
						.replace("{user}", userObj.user.username)
						.replace("{reason}", reason)
						.replace("{staff}", staff);

					const embedDescription = String(
						banConfig?.announce_embed_description || "**Reason:** `{reason}`\nStaff: {staff}",
					)
						.replace("{user}", userObj.user.username)
						.replace("{reason}", reason)
						.replace("{staff}", staff);

					const anounceEmbed = new EmbedBuilder()
						.setTitle(emebedTitle)
						.setDescription(embedDescription)
						.setColor(16722499);

					channelObj.send({ embeds: [anounceEmbed] });
				}
			}

			const successEmbed = new EmbedBuilder().setTitle(":white_check_mark: Success!");

			const interactionReplyLocales = {
				"pt-BR": `O usuário ${userObj} foi banido com sucesso!\n${
					banConfig?.announce === 1
						? `Anúncio enviado no canal <#${banConfig.announce_channel}>!`
						: "Não anunciado porque não foi configurado OU foi desligado!!"
				}`,
				"en-US": `The user ${userObj} has been banned successfully!\n${
					banConfig?.announce === 1
						? `Announced on channel <#${banConfig.announce_channel}>!`
						: "Not announced because not configured OR turned off!"
				}`,
			}.setDescription(interactionReplyLocales[guildLocale]);

			interaction.editReply({
				embeds: [successEmbed],
				ephemeral: true,
			});
		} catch (error) {
			pino.error(error);

			errorEmbed.setDescription("An error ocurred. please try again later!");
			interaction.editReply({ embeds: [errorEmbed], ephemeral: true });

			return true;
		}
	},
	options: {
		userPermissions: ["BanMembers"],
		timeout: commandTimeout,
	},
};
