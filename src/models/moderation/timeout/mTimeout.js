const pino = require("../../../../logger");
const { checkGuildLocale } = require("../../guilds/locale");
const prettyMs = require("ms-prettify").default;
const ms = require("ms");
const { checkRolePosition } = require("../../validations/checkRolePosition");
const { errorEmbed } = require("../../embeds/defaultEmbeds");
/**
 * @param {import('discord.js').Interaction} interaction
 */

async function setTimeout(interaction) {
	const userSelected = interaction.options.get("user").value;
	const duration = interaction.options.get("duration").value;
	const reason = interaction.options.get("reason")?.value || "No reason provided";
	const serverLocale = await checkGuildLocale(interaction.guild.id);

	await interaction.deferReply();

	const userObj =
		interaction.guild.members.cache.get(userSelected) ||
		(await interaction.guild.members.fetch(userSelected).catch(() => {}));

	if (!userObj) {
		errorEmbed.setDescription("That user doesn't exist in this server!");
		interaction.editReply({ embeds: [errorEmbed] });
		return;
	}

	const checkrole = await checkRolePosition(interaction, userObj, "timeout");

	if (!checkrole) {
		return false;
	}

	const msDuration = ms(duration);

	if (Number.isNaN(msDuration)) {
		const errorLocale = {
			"pt-BR": "Por favor, insira uma duração valida!",
			"en-US": "Please provide a valid duration!",
		};
		await interaction.editReply({
			content: errorLocale[serverLocale] || errorLocale["en-US"],
			ephemeral: true,
		});
		return;
	}

	if (msDuration < 5000 || msDuration > 2.419e9) {
		const errorLocale = {
			"pt-BR": "A duração do timeout não pode ser menor que 5 segundos ou maior que 28 dias!",
			"en-US": "Timeout duration cannot be less than 5 seconds or more than 28 days!",
		};
		await interaction.editReply({
			content: errorLocale[serverLocale] || errorLocale["en-US"],
			ephemeral: true,
		});
		return;
	}

	try {
		if (userObj.isCommunicationDisabled()) {
			await userObj.timeout(msDuration, reason);

			const updateTimeoutLocale = {
				"pt-BR": `O timeout do usuário ${userObj} foi atualizado para ${prettyMs(
					msDuration,
				)}\nMotivo: ${reason}`,
				"en-US": `${userObj}'s timeout has been updated to ${prettyMs(msDuration)}\nReason: ${reason}`,
			};

			await interaction.editReply(updateTimeoutLocale[serverLocale] || updateTimeoutLocale["en-US"]);
			return;
		}

		await userObj.timeout(msDuration, reason);

		const setTimeoutLocale = {
			"pt-BR": `O usuário ${userObj} tomou timeout por ${prettyMs(msDuration)}\nMotivo: ${reason}`,
			"en-US": `${userObj}'s was timeout for ${prettyMs(msDuration)}\nReason: ${reason}`,
		};

		await interaction.editReply(setTimeoutLocale[serverLocale] || setTimeoutLocale["en-US"]);
	} catch (error) {
		await interaction.editReply("An error ocurred! Please report to Hiroshi's BOT Team!");
		pino.error(error);
	}
}

/**
 * @param {import('discord.js').Interaction} interaction
 */

async function removeTimeout(interaction) {
	const userSelected = interaction.options.get("user").value;
	const serverLocale = await checkGuildLocale(interaction.guild.id);

	await interaction.deferReply();

	const userObj =
		interaction.guild.members.cache.get(userSelected) ||
		(await interaction.guild.members.fetch(userSelected).catch(() => {}));

	if (!userObj) {
		errorEmbed.setDescription("That user doesn't exist in this server!");
		interaction.editReply({ embeds: [errorEmbed] });
		return;
	}

	if (!userObj.isCommunicationDisabled()) {
		const notTimedOutLocales = {
			"pt-BR": "O usuário selecionado não está em timeout!",
			"en-US": "The selected user is not timed out!",
		};
		interaction.editReply(notTimedOutLocales[serverLocale] || notTimedOutLocales["en-US"]);
		return;
	}

	const checkrole = await checkRolePosition(interaction, userObj, "remove timeout");

	if (!checkrole) {
		return false;
	}

	await userObj.timeout(null);

	const successLocales = {
		"pt-BR": `O usuário ${userObj} foi removido do timeout!`,
		"en-US": `The user ${userObj} has been removed from timeout`,
	};

	await interaction.editReply(successLocales[serverLocale] || successLocales["en-US"]);
}

module.exports = {
	setTimeout,
	removeTimeout,
};
