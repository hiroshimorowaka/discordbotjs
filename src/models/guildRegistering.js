const {query} = require('../../infra/database');

async function registerGuild(guild_id) {
  return await query(
    "INSERT INTO banned_words (guild_id) VALUES($1) ON CONFLICT (guild_id) DO NOTHING;",
    [guild_id],
  );
}

async function unregisterGuild(guild_id) {
  return await query(
    "DELETE FROM banned_words WHERE guild_id = $1",
    [guild_id],
  );
}

module.exports = {
  registerGuild,
  unregisterGuild
}