const {Interaction} = require('discord.js')
/**
 * @param {Interaction} interaction 
 * @returns 
 */

module.exports = async (interaction, commandObj) => {
  if(commandObj.requiredPermissions && commandObj.requiredPermissions?.length !== 0){

    for(permission of commandObj.requiredPermissions){
      const has_permission = await interaction.member.permissions.has(permission);
      if(has_permission){
        return false;
      }
    }  
    interaction.reply({content: "You don't have permission to use this command!", ephemeral: true});
    return true;
  }

}