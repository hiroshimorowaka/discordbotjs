const { Guild, Client, EmbedBuilder } = require("discord.js");
const { logs } = require("../../../../config.json");
/**
 *
 * @param {Guild} guild
 * @param {Client} client
 */
async function sendBotGuildLeaveLog(guild, client) {
  const logEmbed = new EmbedBuilder()
    .setTitle("Me expulsaram do server ;-;")
    .addFields(
      { name: "Nome do server:", value: `${guild.name} ||${guild.id}||` },
      { name: "Membros:", value: `${guild.memberCount}` },
      { name: "Dono:", value: `<@${guild.ownerId}> ||${guild.ownerId}||` },
    )
    .setColor([255, 0, 0]);

  if (logs.guildid && logs.commandLogs) {
    const guild =
      client.guilds.cache.get(logs.guildid) ||
      (await client.guilds.fetch(logs.guildid));

    const channel =
      guild.channels.cache.get(logs.leaveGuildLogs) ||
      (await guild.channels.fetch(logs.leaveGuildLogs));

    if (guild && channel) {
      channel.send({ embeds: [logEmbed] });
    }
  }
}

module.exports = {
  sendBotGuildLeaveLog,
};
