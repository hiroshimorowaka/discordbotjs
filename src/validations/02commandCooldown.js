const ms = require('ms-prettify').default
const {Client, Interaction} = require('discord.js')
/**
 * @param {Interaction} interaction 
 * @param {Client} client 
 * @returns 
 */

module.exports = (interaction, commandObj,_,client) => {
  const cooldown = client.cooldowns.get(`${interaction.user.id}_${commandObj.name}` || 0);
  const date_now = Date.now()
  if(date_now - cooldown < 0){
    interaction.reply({content: `This command is on cooldown of ${ms(cooldown - date_now)}, please wait!`, ephemeral: true});
    return true
  }
}