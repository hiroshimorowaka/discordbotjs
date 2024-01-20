const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { maxWarnCommand } = require("../../models/settings/warn/setMaxWarns");
const { warnPunishmentCommand } = require("../../models/settings/warn/setWarnPunishmentType");
const { setGuildLocaleCache } = require("../../../infra/redis");
const { setGuildLocaleDatabase } = require("../../models/guilds/locale");
const { setBanConfig, setBanAnnouncement } = require("../../models/settings/ban/banConfig");
const pino = require("../../../logger");
const { errorEmbed } = require("../../models/embeds/defaultEmbeds");

const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Set settings to specified features!")
		.setDMPermission(false)
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
								.addChoices(
									{ name: "Kick", value: 1 },
									{ name: "Ban", value: 2 },
									{ name: "Timeout", value: 3 },
								),
						)

						.addStringOption((option) =>
							option
								.setName("timeout_duration")
								.setDescription(
									"Timeout duration if you choose Timeout as punish type! (5s, 30m, 1h, 1 day) (Default: 10m)",
								),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("max")
						.setDescription("The maximum of warns to user has been punished!")

						.addIntegerOption((option) =>
							option
								.setName("limit")
								.setDescription(
									"Number of warnings that will punish the member when reached (Integer Number)",
								)
								.setMinValue(1)
								.setRequired(true),
						),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("locale")
				.setDescription("Set locale for your server (Default: pt-BR)!")

				.addStringOption((option) =>
					option
						.setName("locale")
						.setDescription("Your locale! Supported languages: pt-BR, en-US")
						.setRequired(true)
						.addChoices(
							{ name: "Português Brasileiro", value: "pt-BR" },
							{ name: "English US", value: "en-US" },
						),
				),
		)
		.addSubcommandGroup((subCommandGroup) =>
			subCommandGroup
				.setName("ban")
				.setDescription("Settings to command /ban!")
				.setDescriptionLocalization("pt-BR", "Configuração do comando /ban")

				.addSubcommand((subCommand) =>
					subCommand
						.setName("announcement")
						.setDescription("Configure announce channel to banned people")
						.setDescriptionLocalization(
							"pt-BR",
							"Configura qual canal será utilizado para anunciar o banimento",
						)

						.addIntegerOption((option) =>
							option
								.setName("announce")
								.setDescription("Is to be annouced on specified channel?")
								.setDescriptionLocalization("pt-BR", "É para anunciar no canal especifico?")
								.setRequired(true)
								.addChoices({ name: "Yes!", value: 1 }, { name: "No!", value: 0 }),
						)

						.addChannelOption((option) =>
							option
								.setName("channel")
								.setDescription("The channel to be announced")
								.setDescriptionLocalization("pt-BR", "Selecione o canal para ser anunciado!")
								.addChannelTypes(ChannelType.GuildText),
						)

						.addStringOption((option) =>
							option
								.setName("embed_title")
								.setDescription(
									"The title of the message to be sent! Placeholder: {user} | {reason} | {staff}",
								)
								.setDescriptionLocalization(
									"pt-BR",
									"O titulo da mensagem que será enviada! Placeholder: {user} | {reason} | {staff}",
								)
								.setMinLength(5)
								.setMaxLength(100),
						)
						.addStringOption((option) =>
							option
								.setName("embed_description")
								.setDescription(
									"The description/content of the message to be sent! Placeholder: {user} | {reason} | {staff}",
								)
								.setDescriptionLocalization(
									"pt-BR",
									"A descrição/conteúdo da mensagem que será enviada! Placeholder: {user} | {reason} | {staff}",
								)
								.setMinLength(5)
								.setMaxLength(200),
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
		if (subCommand === "locale") {
			const locales = {
				"pt-BR": "Sua lingua foi setada com sucesso!",
				"en-US": "Your language has been set successfully!",
			};

			const locale = interaction.options.getString("locale").trim();
			try {
				await setGuildLocaleDatabase(interaction.guildId, locale);
				setGuildLocaleCache(interaction.guildId, locale);

				interaction.reply(locales[locale]);

				return;
			} catch (error) {
				pino.error(error);
				interaction.reply("An error ocurred on executing this command!");
			}
		}

		if (subCommandGroup === "ban") {
			if (subCommand === "announcement") {
				const isToBeAnnounced = interaction.options.getInteger("announce");

				const channelAnnounce = interaction.options?.getChannel("channel");
				const embedTitle = interaction.options?.getString("embed_title");
				const embedDescription = interaction.options?.getString("embed_description");

				const guild_id = interaction.guildId;
				await interaction.deferReply();

				if (isToBeAnnounced === 1) {
					if (!channelAnnounce || !embedTitle || !embedDescription) {
						errorEmbed.setDescription(
							"If announce has been set to 'Yes!' you need to specify all other optional options!",
						);
						await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
						return;
					}

					try {
						await setBanConfig(guild_id, isToBeAnnounced, channelAnnounce.id, embedTitle, embedDescription);

						interaction.editReply(`
            Your configuration has been set successfully!\nChannel: ${channelAnnounce}\nIs to be announced?: ${Boolean(
							isToBeAnnounced,
						)}
            `);
					} catch (error) {
						pino.error(error);
						interaction.editReply("An error ocurred on set ban config!");
					}
				} else {
					try {
						await setBanAnnouncement(guild_id, isToBeAnnounced);

						interaction.editReply({ content: "The announcement has been turned off!", ephemeral: true });
					} catch (error) {
						pino.error(error);
						interaction.editReply("An error ocurred on set ban config!");
					}
				}
			}
		}
	},
	options: {
		userPermissions: ["ManageGuild"],
		timeout: commandTimeout,
	},
};
