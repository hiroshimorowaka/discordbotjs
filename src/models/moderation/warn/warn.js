const {checkRolePosition} = require('../../validations/checkRolePosition');
const {query} = require('../../../../infra/database');
const {punish} = require('./punishType');
const pino = require("../../../../logger");
const {EmbedBuilder} = require("discord.js")
const { errorEmbed } = require("../../embeds/defaultEmbeds")

/**
  * @param {import('discord.js').Interaction} interaction 
  */

async function checkUserWarns(guild_id,user_id){
  const result = await query('SELECT * FROM warns WHERE guild_id = $1 AND user_id = $2',[guild_id,user_id]);

  const maxWarnsConfig = await query('SELECT * FROM warn_config WHERE guild_id = $1',[guild_id]);
  const maxWarns = maxWarnsConfig.rows[0]?.max_warns;
  const punishment_type = maxWarnsConfig.rows[0]?.punishment_type;
  const timeout_duration = maxWarnsConfig.rows[0]?.timeout_duration || 0;
  const count = result.rowCount;

  if(!maxWarns || !punishment_type || punishment_type === 0){
    return false;
  }

  return {count,maxWarns,punishment_type,timeout_duration};
}
/**
  * @param {import('discord.js').Interaction} interaction 
  */
async function addWarn(interaction){
  const userSelectedId =  interaction.options.get('user').value
  let reason = interaction.options.get('reason')?.value
  const requestUser = interaction.member.id
  const guildId = interaction.guildId;
  if (!reason) reason = 'No Reason Provided';

  await interaction.deferReply();

  const userSelectedObj = interaction.guild.members.cache.get(userSelectedId) || await interaction.guild.members.fetch(userSelectedId).catch(() => {});

  if (!userSelectedObj){
    await query('DELETE FROM warns WHERE user_id = $1',[userSelectedId]);
    
    errorEmbed
    .setDescription("That user doesn't exist in this server!")

    await interaction.editReply({embeds: [errorEmbed], ephemeral: true});
    return false;
  }

  const checkRole = await checkRolePosition(interaction,userSelectedObj,'warn')
  pino.info(`models/warn.js -> Check Role Position: ${checkRole}`);
  if(!checkRole) 
  {
    return false;
  };

  try{

    await query("INSERT INTO warns (guild_id,user_id,reason,staff) VALUES ($1,$2,$3,$4)",[guildId,userSelectedId,reason,requestUser])

    const userWarnsResult = await checkUserWarns(guildId,userSelectedId);
    pino.info(`models/warn.js -> Check User Warns: ${JSON.stringify(userWarnsResult)}`);

    if (!userWarnsResult){
      errorEmbed
      .setDescription('The warn feature is not configured to this server! Please use /settings warn!');
      interaction.editReply({embeds: [errorEmbed], ephemeral: true});
      return
    }

    let needToPunish = userWarnsResult.count >= userWarnsResult.maxWarns;
    const embed = new EmbedBuilder()
    .setTitle('Member Warned!')

    if (needToPunish){
      const punishmentType = userWarnsResult.punishment_type;
      const punishment = punish[punishmentType]?.run;

      if(punishment){
        const punish_message = punishment(userSelectedObj,reason,userWarnsResult.timeout_duration);
        
        embed
        .setDescription(`${punish_message}`)
        interaction.editReply({embeds: [embed]});
        return;
      }else{
        pino.error('Error when punish member, this method does not exists (punish type)');
          errorEmbed
          .setDescription('Error when try to punish member (method do not exists)!')
        interaction.editReply({embeds: [errorEmbed], ephemeral: true});
        return
      }
      
    }
    embed
    .setDescription(`${userSelectedObj} has been warned`)
    interaction.editReply({embeds: [embed], ephemeral: true});

  }catch(e){
    errorEmbed
    .setDescription('An error ocurred when executing this command!')
    interaction.editReply({embeds: [errorEmbed], ephemeral: true});
    pino.error(e)
  }

}
/**
  * @param {import('discord.js').Interaction} interaction 
  */
async function removeWarn(interaction){
  const userSelectedId =  interaction.options.get('user').value
  const guildId = interaction.guildId;

  let amount = interaction.options.get('quantity')?.value;


  await interaction.deferReply();
  
  const userSelectedObj = interaction.guild.members.cache.get(userSelectedId) || await interaction.guild.members.fetch(userSelectedId);
  
  if (!userSelectedObj){
    await query('DELETE FROM warns WHERE user_id = $1',[userSelectedId]);
    return false;
  }

  const checkRole = await checkRolePosition(interaction,userSelectedObj,'warn')
  pino.info(`models/warn.js -> Check Role Position: ${checkRole}`);
  if(!checkRole) 
  {
    return false;
  };

  try{

    const userWarnsResult = await checkUserWarns(guildId,userSelectedId);
    pino.info(`models/warn.js -> Check User Warns: ${JSON.stringify(userWarnsResult)}`);

    if (!userWarnsResult?.count){
      const warnEmbed = new EmbedBuilder()
      .setTitle('⚠️ Warning!')
      .setDescription("This user don't have warns to remove!")
      .setColor(14397952)

      interaction.editReply({embeds: [warnEmbed], ephemeral: true});
      return false;
    }

    if(amount > userWarnsResult.count ) amount = userWarnsResult.count;

    if(!amount) amount = 1;

    await query(`DELETE FROM warns WHERE ctid IN (SELECT ctid FROM warns WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2);`,[userSelectedId,amount]);


    const embed = new EmbedBuilder()
    .setTitle('Warn Removed!')

    if(amount > 1){
      embed
      .setDescription(`**${amount}** warns has been removed from ${userSelectedObj}`)
    }else{
      embed
      .setDescription(`The warn from ${userSelectedObj} has been removed!`)
    }

    interaction.editReply({embeds: [embed]})

  }catch(e){
    interaction.editReply('An error ocurred when executing this command!');
    pino.error(e)
  }

}


module.exports = {
  checkUserWarns,
  addWarn,
  removeWarn
}