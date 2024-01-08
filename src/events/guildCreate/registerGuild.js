const pino = require('../../../logger')
const { registerGuild } = require('../../models/guilds/guildRegistering')

const {Guild} = require('discord.js')
/**
 * @param {Guild} guild 
 * @returns 
 */

module.exports = async (guild) => {
  pino.info(`Bot has invited to new guild ${guild.id} ${guild.name} | Creating this guild on database`)
  
  await registerGuild(guild.id).then((r) => {
    if(r.rowCount > 0){
      pino.info(`Ev: guildCreate Model: registerGuild.js -> Guild registered ${guild.id} ${guild.name}`);
    }else{
      pino.info(`Ev: guildCreate Model: registerGuild.js -> Guild already registered ${guild.id} ${guild.name}`);
    }
  });
}