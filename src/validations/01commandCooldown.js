const ms = require('ms-prettify').default
const {Client, Interaction} = require('discord.js')
/**
 * @param {import('commandkit').SlashCommandProps} param0 
 */

module.exports = ({interaction,commandObj}) => {
  const cooldown = interaction.client.cooldowns.get(`${interaction.user.id}_${commandObj.name}` || 0);
  const date_now = Date.now()
  if(date_now - cooldown < 0){
    interaction.reply({content: `This command is on cooldown of ${ms(cooldown - date_now)}, please wait!`, ephemeral: true});
    return true
  }
}