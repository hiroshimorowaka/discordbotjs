
const {deleteInfoOnExitGuild} = require('../../models/guilds/deleteInfoOnExitGuild');

module.exports = (member) => {
  const userId = member.id
  const guildId = member.guild.id
  deleteInfoOnExitGuild(guildId,userId);
}