const ms = require("ms-prettify").default;
/**
 * @param {import('commandkit').SlashCommandProps} param0
 */

module.exports = ({ interaction, commandObj }) => {
	const cooldown = interaction.client.cooldowns.get(`${interaction.user.id}_${commandObj.data.name}` || 0);
	const date_now = Date.now();
	if (date_now - cooldown < 0) {
		interaction.reply({
			content: `This command is on cooldown of <t:${Math.round(cooldown / 1000)}:R> ${ms(
				cooldown - date_now,
			)}, please wait!`,
			ephemeral: true,
		});
		return true;
	}
};
