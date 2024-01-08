const {devs} = require('../../config.json')

module.exports = (interaction, commandObj) => {
  if(commandObj.devOnly){
    if(!devs.includes(interaction.member.id)){
      interaction.reply("This command is for developers only!");
      return true;
    }
  }
}