const { checkGuildLocale } = require("../models/guilds/locale");

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */

module.exports = async ({ interaction, commandObj }) => {
	const cooldown = interaction.client.cooldowns.get(`${interaction.user.id}_${commandObj.data.name}` || 0);
	const date_now = Date.now();
	const serverLocale = await checkGuildLocale(interaction.guildId);

	const locales = {
		"pt-BR": `Esse comando está em cooldown, ele ficará disponivel <t:${Math.round(
			cooldown / 1000,
		)}:R>, por favor aguarde!`,
		"en-US": `This command is on cooldown, it will become available <t:${Math.round(
			cooldown / 1000,
		)}:R>, please wait!`,
	};

	if (date_now - cooldown < 0) {
		interaction.reply({
			content: locales[serverLocale] || locales["en-US"],
			ephemeral: true,
		});

		return true;
	}
};
