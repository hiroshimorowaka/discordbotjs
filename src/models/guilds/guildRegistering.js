const {query} = require('../../../infra/database');

async function registerGuild(guild_id) {
  await query(
    "INSERT INTO banned_words (guild_id) VALUES($1) ON CONFLICT (guild_id) DO NOTHING;",
    [guild_id],
  );
  await query(
    "INSERT INTO logs (guild_id) VALUES($1) ON CONFLICT (guild_id) DO NOTHING;",
    [guild_id],
  );
  return true;
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