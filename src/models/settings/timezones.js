const { query } = require("../../../infra/database");

async function setTimezone(guild_id, timezone) {
	const result = await query("UPDATE guild_config SET timezone = $2 WHERE guild_id = $1;", [
		guild_id,
		timezone,
	]);
	return result;
}

async function getTimezone(guild_id) {
	const result = await query("SELECT timezone FROM guild_config WHERE guild_id = $1;", [guild_id]);
	return result.rows[0]?.timezone;
}

module.exports = {
	setTimezone,
	getTimezone,
};
