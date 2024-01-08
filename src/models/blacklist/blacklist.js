const { EmbedBuilder } = require("discord.js");
const {
  GetBanWord,
  RemoveBannedWord,
  setBannedWord,
  GetBannedWords,
} = require("../blacklist/ban_words.js");

const pino = require('../../../logger.js')
const { removeListCache, addListCache } = require("../../../infra/redis.js");

async function removeBlacklistWord(interaction, client) {
  const word = await interaction.options.get("word").value.replace(/ /g,'');
  const new_word = word.split(',');
  const guild_id = await interaction.guildId;
  if (new_word) {
    try {
      const wordExist = await GetBanWord(guild_id, new_word);
      if (wordExist) {
        await RemoveBannedWord(guild_id, new_word);
        removeListCache(guild_id, word);
      } else {
        return await interaction.reply(
          "This word dosen't exist on database of this server!",
        );
      }
    } catch (error) {
      await interaction.reply({
        content: "A error ocurred on remove ban word on database!",
        ephemeral: true,
      });
      pino.error(`Remove Ban Word Error: `, error);
      return;
    }
    return await interaction.reply({
      content: "Word removed successfully!",
      ephemeral: true,
    });
  }
}

async function addBlacklistWord(interaction, client) {
  const word = await interaction.options.get("word").value.replace(/ /g,'');
  const new_word = word.split(',');
  const guild_id = await interaction.guildId;

  if (new_word) {
    try {
      const WordExist = await GetBanWord(guild_id, new_word);
      if (!WordExist) {
        await setBannedWord(guild_id, new_word);
        await addListCache(guild_id, word);
      } else {
        return await interaction.reply("This Word already exists!");
      }
    } catch (error) {
      await interaction.reply({
        content: "A error ocurred on insert ban word on database!",
        ephemeral: true,
      });
      pino.error(`Ban Word Insert Error: `, error);
      return;
    }
    return await interaction.reply({
      content: "Word set successfully!",
      ephemeral: true,
    });
  }
}

async function listBlacklistWords(interaction, client) {
  const list = new EmbedBuilder().setTitle("Banned Words List!");
  try {
    const result = await GetBannedWords(interaction.guildId);
    
    if(result.length === 0){
      interaction.reply({content: "This server dosen't have seted blacklist words yet!", ephemeral: true});
      return false;
    }

    for (let word of result) {
      list.addFields({ name: `${word.toUpperCase()}`, value: `.` });
    }
    return await interaction.reply({ embeds: [list] });
  } catch (error) {
    pino.error(error);
    return await interaction.reply({
      content: "A error ocurred on list ban words!",
      ephemeral: true,
    });
  }
}

module.exports = {
  listBlacklistWords,
  removeBlacklistWord,
  addBlacklistWord,
};
