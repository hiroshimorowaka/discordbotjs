const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { maxWarnCommand } = require("../../models/settings/warn/setMaxWarns");
const { warnPunishmentCommand } = require("../../models/settings/warn/setWarnPunishmentType");
const { setGuildLocaleCache } = require("../../../infra/redis");
const { setGuildLocaleDatabase, checkGuildLocale } = require("../../models/guilds/locale");
const { setBanConfig, setBanAnnouncement } = require("../../models/settings/ban/banConfig");
const { setTimezone } = require("../../models/settings/timezones");

const pino = require("../../../logger");
const { errorEmbed } = require("../../models/embeds/defaultEmbeds");

const commandTimeout = 3000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setNameLocalization("pt-BR", "configuracoes")
		.setDescription("Bot features setting!")
		.setDescriptionLocalization("pt-BR", "Configura funcionalidades especificas do bot!")
		.setDMPermission(false)
		.addSubcommandGroup((subCommandGroup) =>
			subCommandGroup
				.setName("warns")
				.setDescription("Settings to warn system!")
				.setDescriptionLocalization("pt-BR", "Configurações do sistema de warn!")
				.addSubcommand((subCommand) =>
					subCommand
						.setName("punishment")
						.setNameLocalization("pt-BR", "punicao")
						.setDescription("Select the type of punishment the user will recieve after reach warns limit!")
						.setDescriptionLocalization(
							"pt-BR",
							"Seleciona o tipo de punição que o usuário ira receber ao atingir o limite de warns",
						)

						.addIntegerOption((option) =>
							option
								.setName("type")
								.setNameLocalization("pt-BR", "tipo")
								.setDescription("The punish type!")
								.setDescriptionLocalization("pt-BR", "O tipo da punição!")
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
								.setNameLocalization("pt-BR", "duracao_do_timeout")
								.setDescription(
									"Timeout duration if you choose Timeout as punish type! (5s, 30m, 1h, 1 day) (Default: 10m)",
								)
								.setDescriptionLocalization(
									"pt-BR",
									"Duração do timeout caso você escolha 'timeout' como tipo de punição! (5s, 30m, 1h, 1 day)",
								),
						),
				)
				.addSubcommand((subCommand) =>
					subCommand
						.setName("max")
						.setNameLocalization("pt-BR", "maximo")
						.setDescription("The maximum of warns to user has been punished!")
						.setDescriptionLocalization("pt-BR", "O maximo de warns para que o usuário seja punido!")

						.addIntegerOption((option) =>
							option
								.setName("limit")
								.setDescription(
									"Number of warnings that will punish the member when reached (Integer Number)",
								)
								.setDescriptionLocalization(
									"pt-BR",
									"O número de warns que irá punir o membro ao ser atingido! (Número inteiro)",
								)
								.setMinValue(1)
								.setMaxValue(100)
								.setRequired(true),
						),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("language")
				.setNameLocalization("pt-BR", "idioma")
				.setDescription("Set the bot language for your server (Default: pt-BR)!")
				.setDescriptionLocalization("pt-BR", "Define a linguagem que o BOT irá falar no servidor!")

				.addStringOption((option) =>
					option
						.setName("language")
						.setNameLocalization("pt-BR", "idioma")
						.setDescription("Select your language!")
						.setDescriptionLocalization("pt-BR", "Selecione a lingua!")
						.setRequired(true)
						.addChoices(
							{ name: "Português Brasileiro", value: "pt-BR" },
							{ name: "English US", value: "en-US" },
						),
				),
		)

		.addSubcommand((subCommand) =>
			subCommand
				.setName("timezone")
				.setDescription("Set your timezone!")
				.setDescriptionLocalization("pt-BR", "Configure sua timezone! Padrão: America/Sao_Paulo (GMT-3) !")

				.addStringOption((option) =>
					option
						.setName("timezone")
						.setDescription("Select your timezone!")
						.setDescriptionLocalization("pt-BR", "Selecione a timezone!")
						.setRequired(true)
						.addChoices(
							{ name: "São Paulo - BR", value: "America/Sao_Paulo" },
							{ name: "New York - US", value: "America/New_York" },
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
						.setNameLocalization("pt-BR", "anuncio")
						.setDescription("Configure announce channel to banned people")
						.setDescriptionLocalization(
							"pt-BR",
							"Configura qual canal será utilizado para anunciar o banimento",
						)

						.addIntegerOption((option) =>
							option
								.setName("announce")
								.setNameLocalization("pt-BR", "anunciar")
								.setDescription("Is to be annouced on specified channel?")
								.setDescriptionLocalization("pt-BR", "É para anunciar no canal especificado?")
								.setRequired(true)
								.addChoices({ name: "Yes!", value: 1 }, { name: "No!", value: 0 }),
						)

						.addChannelOption((option) =>
							option
								.setName("channel")
								.setNameLocalization("pt-BR", "canal")
								.setDescription("The channel to be announced")
								.setDescriptionLocalization("pt-BR", "Selecione o canal para ser anunciado!")
								.addChannelTypes(ChannelType.GuildText),
						)

						.addStringOption((option) =>
							option
								.setName("embed_title")
								.setNameLocalization("pt-BR", "titulo_embed")
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
								.setNameLocalization("pt-BR", "descricao_embed")
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
		if (subCommand === "language") {
			const locales = {
				"pt-BR": "Sua lingua foi setada com sucesso!",
				"en-US": "Your language has been set successfully!",
			};

			const locale = interaction.options.getString("language").trim();
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

		if (subCommand === "timezone") {
			const timezone = interaction.options.getString("timezone");
			try {
				await setTimezone(interaction.guildId, timezone);
				interaction.reply("Your timezone has been set successfully!");
			} catch (error) {
				pino.error(error);
				interaction.reply("An error ocurred!");
			}
		}

		if (subCommandGroup === "ban") {
			const serverLocale = await checkGuildLocale(interaction.guild.id);
			if (subCommand === "announcement") {
				const isToBeAnnounced = interaction.options.getInteger("announce");

				const channelAnnounce = interaction.options?.getChannel("channel");
				const embedTitle = interaction.options?.getString("embed_title");
				const embedDescription = interaction.options?.getString("embed_description");

				const guild_id = interaction.guildId;
				await interaction.deferReply({ ephemeral: true });

				if (isToBeAnnounced === 1) {
					if (!channelAnnounce || !embedTitle || !embedDescription) {
						const errorLocales = {
							"pt-BR": "Se 'anunciar' foi setado como 'yes!', você precisa preencher todas as outras opções",
							"en-US": "If announce has been set to 'Yes!' you need to specify all other optional options!",
						};

						errorEmbed.setDescription(errorLocales[serverLocale] || errorLocales["en-US"]);

						await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
						return;
					}

					try {
						await setBanConfig(guild_id, isToBeAnnounced, channelAnnounce.id, embedTitle, embedDescription);

						const successLocales = {
							"pt-BR": `Suas configuraçÕes foram setadas com successo!\nCanal setado para anunciar: ${channelAnnounce}`,
							"en-US": `Your configuration has been set successfully!\nChannel to announce: ${channelAnnounce}`,
						};

						interaction.editReply(successLocales[serverLocale] || successLocales["en-US"]);
					} catch (error) {
						pino.error(error);
						interaction.editReply("An error ocurred on set ban config!");
					}
				} else {
					try {
						await setBanAnnouncement(guild_id, isToBeAnnounced);

						const turnOffAnnounceLocales = {
							"pt-BR": "O anuncio dos banimentos foi desligado!",
							"en-US": "The ban announcement has been turned off!",
						};

						interaction.editReply({
							content: turnOffAnnounceLocales[serverLocale] || turnOffAnnounceLocales["en-US"],
							ephemeral: true,
						});
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
