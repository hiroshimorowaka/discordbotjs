const { GetBannedWords } = require("../../models/blacklist/ban_words.js");

const { addListCache } = require("../../../infra/redis.js");

const {registerGuild} = require('../../..//infra/database.js')

module.exports = async(guild) => {
  console.log(`Ev: guildAvailable Model: registerBanWords.js -> Registering Guild ${guild.id}`);
  registerGuild(guild.id).then((r) => {
    if(r.rowCount > 0){
      console.log(`Ev: guildAvailable Model: registerBanWords.js -> Guild registered ${guild.id}`);
    }else{
      console.log(`Ev: guildAvailable Model: registerBanWords.js -> Guild already registered ${guild.id}`);
    }
  });
  console.log("Ev: guildAvailable Model: registerBanWords.js -> Seting banned words!");
  const banned_words_db = await GetBannedWords(guild.id);
  if (banned_words_db.length === 0) return;
  addListCache(guild.id, banned_words_db)
  .then((r) => 
  {
    console.log('Ev: guildAvailable Model: registerBanWords.js ->  Words setted on cache!');
  }).catch((e) => {
    console.error(e)
  });
}