const {query} = require('../../../infra/database');
const {punish} = require('../../models/moderation/warn/punishType')
const {errorEmbed} = require('../../models/embeds/defaultEmbeds');
const ms = require('ms')
const pino = require("../../../logger");
const {EmbedBuilder} = require('discord.js')
const msPretty = require('ms-prettify').default;

/**
 * @param {import('discord.js').Interaction} interaction 
 */

async function checkGuildRegister(guild_id){
  const result = await query('SELECT * FROM warn_config WHERE guild_id = $1',[guild_id])

  if(result.rowCount === 0){
    return false;
  }
  
  return true;
}

async function setMaxWarnsSettings(guild_id,max_warns){

  await query(`UPDATE warn_config SET max_warns = $2 WHERE guild_id = $1`,[guild_id,max_warns]);
  return true;

}

async function setWarnPunishTypeSettings(guild_id,punishment_type,timeout_duration){

  if(!timeout_duration) timeout_duration = 600000

  await query(`
   UPDATE warn_config SET (punishment_type,timeout_duration) = ($2,$3) WHERE guild_id = $1
  `,[guild_id,punishment_type,timeout_duration]);
return true
}

async function warnPunishmentCommand(interaction){

        const guildId = interaction.guildId

        const punish_type = interaction.options.get('type').value;
        const timeout_duration = interaction.options.get('timeout_duration')?.value || '0s';

        const nameOfPunishment = punish[punish_type]?.name

        if(!nameOfPunishment){
          errorEmbed.setDescription("This punishment type is INVALID! Please select a valid punishment type");
          interaction.editReply({embeds: [errorEmbed], ephemeral: true});
          return;
        }

        const msDuration = ms(timeout_duration);

        if(punish_type === 3){
          
          if(!timeout_duration){
            errorEmbed.setDescription("You Canno't use punishment type `timeout` without specify a timeout duration")
            interaction.editReply({embeds: [errorEmbed], ephemeral: true});
            return;
          }



          if(isNaN(msDuration)){
            errorEmbed.setDescription("Please provide a valid duration!")
            await interaction.editReply({embeds: [errorEmbed], ephemeral: true});
            return;
          }

          if(msDuration < 5000 || msDuration > 2.419e9){
            errorEmbed.setDescription("Timeout duration cannot be less than 5 seconds or more than 28 days!")
            await interaction.editReply({embeds: [errorEmbed], ephemeral: true});
            return;
          }

        }
        
        try{
          const result = await checkGuildRegister(guildId);
          
          if(!result){
              errorEmbed
              .setDescription("Your guild is not registered, please use /setup to register this guild and try again!");
              await interaction.editReply({embeds: [errorEmbed], ephemeral: true});
              return;
          }

          await setWarnPunishTypeSettings(guildId,punish_type,msDuration);

          const success = new EmbedBuilder()
          .setTitle('Warn punishment set successfully!')

          if(punish_type === 3){
            success
            .setDescription(`You set Punishment type: **${nameOfPunishment}** with Timeout Duration: ${msPretty(msDuration)}`);
          }else{
            success
            .setDescription(`You set Punishment type: **${nameOfPunishment}**!`)
          }

          interaction.editReply({embeds: [success]})
          return;
        }catch(e){
          errorEmbed
          .setDescription('An error ocurred on executing this command. Please try again later!');
          interaction.editReply({embeds: [errorEmbed], ephemeral: true});
          pino.error(e)
          return
        }

}

/**
 * @param {import('discord.js').Interaction} interaction 
 */
async function maxWarnCommand(interaction){

  const guildId = interaction.guildId
  const maxWarnLimit = interaction.options.get('limit').value;


try {

  const result = await checkGuildRegister(guildId);
          
  if(!result){
      errorEmbed
      .setDescription("Your guild is not registered, please use /setup to register this guild and try again!");
      await interaction.editReply({embeds: [errorEmbed], ephemeral: true});
      return;
  }

  await setMaxWarnsSettings(guildId,maxWarnLimit)

  const success = new EmbedBuilder()
  .setTitle('Warn max limit set successfully!')
  .setDescription(`You set Warn max limit to: \`${maxWarnLimit}\``)

  interaction.editReply({embeds: [success]})

} catch (error) {
  pino.error(error)
  errorEmbed
  .setDescription("An error ocurred when executing this command. Please try again later!");
  interaction.editReply({embeds: [errorEmbed]});
  return false;
}

  
}


module.exports = {
  warnPunishmentCommand,
  maxWarnCommand
}