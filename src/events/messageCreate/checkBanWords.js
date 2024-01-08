const { GetBannedWords } = require("../../models/blacklist/ban_words.js");

const { addListCache, itemsListCached } = require("../../../infra/redis.js");

const {Message} = require('discord.js')
/**
 * @param {Message} message 
 * @returns 
 */


module.exports = async(message) => {
  const words = message.content.trim().toLowerCase().split(/ +/);
  const cache = await itemsListCached(message.guildId);
  for (i of words) {
    if (cache.includes(i)) {
      await message.delete();
      await message.author.send(`This word (${i}) is banned on this server!`);
      return;
    }
  }
  const db_words = await GetBannedWords(message.guildId);
  for(i of words){
    if(db_words.includes(i)){
      addListCache(message.guildId,i);
      await message.delete();
      await message.author.send(`This word (${i}) is banned on this server!`);
      return;
    }
  }
}