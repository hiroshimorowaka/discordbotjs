const { Interaction, Client, EmbedBuilder } = require("discord.js");
const { logs } = require("../../../../config.json");
/**
 *
 * @param {Interaction} interaction
 * @param {Client} client
 */
async function sendBotCommandLog(
  interaction,
  client,
  options = [],
  subCommandGroup,
  subCommand,
) {
  let subCommands = "";
  if (subCommandGroup) {
    subCommands += " " + subCommandGroup;
  }
  if (subCommand) {
    subCommands += " " + subCommand;
  }

  const logEmbed = new EmbedBuilder()
    .setTitle(`Command LOG: /${interaction.commandName}${subCommands}`)
    .setDescription(
      `**Guild ID:** ${interaction.guildId}\n**User:** <@${interaction.user.id}> ||${interaction.user.id}||`,
    );

  if (options.length > 0) {
    const newOptions = [];
    for (option of options) {
      const newString = `**${option.name}**: ${option.value}\n`;
      newOptions.push(newString);
    }

    logEmbed.addFields({ name: "Options", value: `${newOptions.join(" ")}` });
  }

  if (logs.guildid && logs.commandLogs) {
    const guild =
      client.guilds.cache.get(logs.guildid) ||
      (await client.guilds.fetch(logs.guildid));

    const channel =
      guild.channels.cache.get(logs.commandLogs) ||
      (await guild.channels.fetch(logs.commandLogs));

    if (guild && channel) {
      channel.send({ embeds: [logEmbed] });
    }
  }
}

module.exports = {
  sendBotCommandLog,
};
