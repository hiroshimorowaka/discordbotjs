const pino = require("../../../../logger");
const { EmbedBuilder } = require("discord.js");
const { query } = require("../../../../infra/database");
const { checkGuildRegister } = require("./common");
const { errorEmbed } = require("../../embeds/defaultEmbeds");

async function setMaxWarnsSettings(guild_id, max_warns) {
	await query("UPDATE warn_config SET max_warns = $2 WHERE guild_id = $1", [guild_id, max_warns]);
	return true;
}

/**
 * @param {import('discord.js').Interaction} interaction
 */
async function maxWarnCommand(interaction) {
	const guildId = interaction.guildId;
	const maxWarnLimit = interaction.options.get("limit").value;
	const serverLocale = interaction.guild.preferredLocale;
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

		await setMaxWarnsSettings(guildId, maxWarnLimit);

		const successTitleLocales = {
			"pt-BR": "Limite de advertências setado com sucesso!",
			"en-US": "Warn max limit set successfully!",
		};

		const successDescriptionLocales = {
			"pt-BR": `Você setou o limite de advertências para: \`${maxWarnLimit}\``,
			"en-US": `You set Warn max limit to: \`${maxWarnLimit}\``,
		};

		const success = new EmbedBuilder()
			.setTitle(successTitleLocales[serverLocale] || successTitleLocales["en-US"])
			.setDescription(successDescriptionLocales[serverLocale] || successDescriptionLocales["en-US"]);

		interaction.editReply({ embeds: [success] });
	} catch (error) {
		pino.error(error);
		errorEmbed.setDescription("An error ocurred when executing this command. Please try again later!");
		interaction.editReply({ embeds: [errorEmbed] });
		return false;
	}
}

module.exports = {
	maxWarnCommand,
};
