const ms = require('ms-prettify').default

const {Interaction,Client} = require('discord.js')
/**
 * @param {Interaction} interaction 
 * @param {Client} client 
 * @returns 
 */
module.exports = (interaction, commandObj,_,client) => {
  client.cooldowns.set(`${interaction.user.id}_${commandObj.name}`, Date.now() + (commandObj.timeout || 0));
}