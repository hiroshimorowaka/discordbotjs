const pino = require('../../../../logger')

const prettyMs = require('ms-prettify').default;
const ms = require('ms')
const { checkRolePosition } = require("../../validations/checkRolePosition");

/**
 * @param {import('discord.js').Interaction} interaction 
 */

async function setTimeout(interaction){

const userSelected = interaction.options.get('user').value
const duration = interaction.options.get('duration').value
const reason = interaction.options.get('reason')?.value || "No reason provided";

await interaction.deferReply();
const userObj = interaction.guild.members.cache.get(userSelected) || await interaction.guild.members.fetch(userSelected).catch(() => {});

const checkrole = await checkRolePosition(interaction,userObj,'timeout')

if (!checkrole){
  return false;
}

const msDuration = ms(duration);

if(isNaN(msDuration)){
  await interaction.editReply({content: "Please provide a valid duration!", ephemeral: true});
  return;
}

if(msDuration < 5000 || msDuration > 2.419e9){
  await interaction.editReply({content: "Timeout duration cannot be less than 5 seconds or more than 28 days!", ephemeral: true});
  return;
}


try {

  if(userObj.isCommunicationDisabled()){
    await userObj.timeout(msDuration, reason);
    await interaction.editReply(`${userObj}'s timeout has been updated to ${prettyMs(msDuration)}\nReason: ${reason}`);
    return
  }

  await userObj.timeout(msDuration, reason);
  await interaction.editReply(`${userObj}'s was timeout for ${prettyMs(msDuration)}\nReason: ${reason}`);

} catch (error) {
  await interaction.editReply("An error ocurred ")
  pino.error(error)
}

}


/**
 * @param {import('discord.js').Interaction} interaction 
 */

async function removeTimeout(interaction){
  const userSelected = interaction.options.get('user').value
  
  await interaction.deferReply();
  const userObj = interaction.guild.members.cache.get(userSelected) || await interaction.guild.members.fetch(userSelected);

  if(!userObj.isCommunicationDisabled()){
    interaction.editReply('The user selected is not timed out!')
    return;
  }

  if (!userObj){
    await interaction.editReply({content: "That user doesn't exist in this server!", ephemeral: true}); 
    return false;
  }

  const checkrole = await checkRolePosition(interaction,userObj,'remove timeout')

  if (!checkrole){
    return false;
  }

await userObj.timeout(null);
await interaction.editReply(`The user ${userObj} has been removed from timeout`);

}


module.exports = {
  setTimeout,
  removeTimeout
}