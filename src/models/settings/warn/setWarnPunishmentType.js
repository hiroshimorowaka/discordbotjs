const { punish } = require("../../../models/moderation/warn/punishType");
const pino = require("../../../../logger");
const { EmbedBuilder } = require("discord.js");
const ms = require("ms");
const msPretty = require("ms-prettify").default;
const { query } = require("../../../../infra/database");
const { checkGuildRegister } = require("./common");
const { errorEmbed } = require("../../embeds/defaultEmbeds");

async function setWarnPunishTypeSettings(guild_id, punishment_type, timeout_duration) {
	const timeoutDuration = timeout_duration || 600000;

	await query(
		`
   UPDATE warn_config SET (punishment_type,timeout_duration) = ($2,$3) WHERE guild_id = $1
  `,
		[guild_id, punishment_type, timeoutDuration],
	);
	return true;
}

/**
 * @param {import('discord.js').Interaction} interaction
 */

async function warnPunishmentCommand(interaction) {
	const guildId = interaction.guildId;

	const serverLocale = interaction.guild.preferredLocale;

	const punish_type = interaction.options.get("type").value;
	const timeout_duration = interaction.options.get("timeout_duration")?.value || "0s";

	const nameOfPunishment = punish[punish_type]?.name;

	if (!nameOfPunishment) {
		errorEmbed.setDescription("This punishment type is INVALID! Please select a valid punishment type");
		interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
		return;
	}

	const msDuration = ms(timeout_duration);

	if (punish_type === 3) {
		if (!timeout_duration) {
			const noTimeoutDurationLocales = {
				"pt-BR": "Você não pode usar o tipo de punição 'timeout' sem especificar a duração do timeout!",
				"en-US": "You Canno't use punishment type `timeout` without specify a timeout duration",
			};

			errorEmbed.setDescription(noTimeoutDurationLocales[serverLocale] || noTimeoutDurationLocales["en-US"]);
			interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}

		if (Number.isNaN(msDuration)) {
			const invalidDurationLocales = {
				"pt-BR": "Por favor, informe uma duração valida!",
				"en-US": "Please provide a valid duration!",
			};

			errorEmbed.setDescription(invalidDurationLocales[serverLocale] || invalidDurationLocales["en-US"]);
			await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}

		if (msDuration < 5000 || msDuration > 2.419e9) {
			const timeoutDurationErrorLocales = {
				"pt-BR": "A duração do timeout não pode ser menor que 5 segundos ou maior que 28 dias!",
				"en-US": "Timeout duration cannot be less than 5 seconds or more than 28 days!",
			};

			errorEmbed.setDescription(
				timeoutDurationErrorLocales[serverLocale] || timeoutDurationErrorLocales["en-US"],
			);
			await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
	}

	try {
		const result = await checkGuildRegister(guildId);

		if (!result) {
			const guildNotRegisteredLocales = {
				"pt-BR":
					"Seu servidor não está registrado na base dedados, por favor user `/setup` para registrar esse servidor e tente novamente!",
				"en-US": "Your guild is not registered, please use /setup to register this guild and try again!",
			};

			errorEmbed.setDescription(
				guildNotRegisteredLocales[serverLocale] || guildNotRegisteredLocales["en-US"],
			);

			await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}

		await setWarnPunishTypeSettings(guildId, punish_type, msDuration);

		const successTitleLocales = {
			"pt-BR": "Punicação das advertências setada com sucesso!",
			"en-US": "Warn punishment set successfully!",
		};

		const success = new EmbedBuilder().setTitle(
			successTitleLocales[serverLocale] || successTitleLocales["en-US"],
		);

		if (punish_type === 3) {
			const successWithTimeoutDurationLocales = {
				"pt-BR": `Você selecinou a punição: **${nameOfPunishment}** com duração de: ${msPretty(msDuration)}`,
				"en-US": `You set Punishment type: **${nameOfPunishment}** with Timeout Duration: ${msPretty(
					msDuration,
				)}`,
			};

			success.setDescription(
				successWithTimeoutDurationLocales[serverLocale] || successWithTimeoutDurationLocales["en-US"],
			);
		} else {
			const successPunishLocales = {
				"pt-BR": `Você selecinou a punição: **${nameOfPunishment}**!`,
				"en-US": `You set Punishment type: **${nameOfPunishment}**!`,
			};
			success.setDescription(successPunishLocales[serverLocale] || successPunishLocales["en-US"]);
		}

		interaction.editReply({ embeds: [success] });
		return;
	} catch (e) {
		errorEmbed.setDescription("An error ocurred on executing this command. Please try again later!");
		interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
		pino.error(e);
		return;
	}
}

module.exports = {
	warnPunishmentCommand,
};
