const { GetBannedWords } = require("../../models/blacklist/ban_words.js");

const { addListCache, itemsListCached, addListCache } = require("../../../infra/redis.js");

module.exports = async (message) => {
  const words = message.content.trim().toLowerCase().split(/ +/);
  const cache = await itemsListCached(message.guildId);
  //console.log(cache)
  for (i of words) {
    if (cache.includes(i)) {
      message.delete();
      message.author.send(`This word (${i}) is banned on this server!`);
      return true
    }
  }
  const db_words = await GetBannedWords(message.guildId);
  for(i of words){
    if(db_words.includes(i)){
      addListCache(message.guildId,i);
      message.delete();
      message.author.send(`This word (${i}) is banned on this server!`);
      return true
    }
  }
}