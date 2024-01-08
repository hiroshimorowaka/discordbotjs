const {devs} = require('../../config.json')

const {Interaction} = require('discord.js')
/**
 * @param {Interaction} interaction 
 * @returns 
 */

module.exports = (interaction, commandObj) => {
  if(commandObj.devOnly){
    if(!devs.includes(interaction.member.id)){
      interaction.reply("This command is for developers only!");
      return true;
    }
  }
}