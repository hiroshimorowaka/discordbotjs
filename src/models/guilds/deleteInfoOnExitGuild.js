const { query } = require("../../../infra/database");

async function deleteInfoOnExitGuild(guild_id, user_id) {
	await query("DELETE FROM warns WHERE guild_id = $1 AND user_id = $2", [guild_id, user_id]);
}

module.exports = {
	deleteInfoOnExitGuild,
};
