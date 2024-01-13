/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
module.exports = ({ interaction, commandObj }) => {
  interaction.client.cooldowns.set(
    `${interaction.user.id}_${commandObj.name}`,
    Date.now() + (commandObj.options?.timeout || 0),
  );
};
