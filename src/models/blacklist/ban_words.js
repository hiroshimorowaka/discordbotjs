const { query } = require("../../../infra/database");

async function setBannedWord(guild_id, word) {
  for(i of word){
    var result = await query(
      `
    UPDATE banned_words SET words = array_append(banned_words.words,$2) 
    WHERE banned_words.guild_id = $1;`,
      [guild_id, i],
    );
  }

  return result;
}

async function RemoveBannedWord(guild_id, word) {
  for(i of word){
  var result = await query(
    `
  UPDATE banned_words SET words = array_remove(banned_words.words,$2) 
  WHERE banned_words.guild_id = $1;`,
    [guild_id, i],
  );
  }
  return result;
}

async function GetBannedWords(guild_id) {
  const result = await query("SELECT * FROM banned_words WHERE guild_id = $1", [
    guild_id,
  ]);
  if (result.rows.length === 0 || !result.rows[0].words) return [];
  return result.rows[0].words;
}

async function GetBanWord(guild_id, word) {
  const result = await query("SELECT * FROM banned_words WHERE guild_id = $1", [
    guild_id,
  ]);
  
  if (!result.rows[0].words || result.rows[0].words === 0) return false;
  const db_words = result.rows[0].words;
  for(i of word){
    if(db_words.includes(i)){
      return true
    }
  }
  return false;
}


module.exports = {
  setBannedWord,
  GetBannedWords,
  RemoveBannedWord,
  GetBanWord,
};
