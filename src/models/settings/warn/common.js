const { query } = require("../../../../infra/database");

async function checkGuildRegister(guild_id) {
  const result = await query("SELECT * FROM warn_config WHERE guild_id = $1", [
    guild_id,
  ]);

  if (result.rowCount === 0) {
    return false;
  }

  return true;
}

module.exports = {
  checkGuildRegister,
};
