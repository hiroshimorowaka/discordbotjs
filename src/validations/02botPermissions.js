const permissionName = require('../../permissionNames.json')
const {Interaction} = require('discord.js')
/**
 * @param {Interaction} interaction 
 * @returns 
 */


module.exports = async (interaction, commandObj) => {
  if(commandObj.botPermissions && commandObj.botPermissions?.length !== 0){
    for(var permission of commandObj.botPermissions){
      const has_permission = await interaction.guild.members.me.permissions.has(permission);
      if(has_permission){
        return false;
      }
    }  
    console.log(permission)
    const name = parseInt(permission).toString() 
    interaction.reply({content: `I don't have permission to do this, please give me ${permissionName[name]} permission!`, ephemeral: true});
    return true;
  }

}