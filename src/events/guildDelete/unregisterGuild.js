const pino = require("../../../logger");
const { unregisterGuild } = require("../../models/guilds/guildRegistering");

const { Guild } = require("discord.js");
/**
 * @param {Guild} guild
 * @returns
 */

module.exports = async (guild) => {
  pino.info(
    `Bot as removed from ${guild.id} ${guild.name} | Deleting from database...`,
  );

  await unregisterGuild(guild.id).then((r) => {
    if (r.rowCount > 0) {
      pino.info(
        `Ev: guildDelete Model: unregisterGuild.js -> Guild deleted (${guild.id}) ${guild.name}`,
      );
    } else {
      pino.info(
        `Ev: guildDelete Model: unregisterGuild.js -> Guild already deleted ${guild.id} ${guild.name}`,
      );
    }
  });
};
