const { query } = require("../../../infra/database");
const { redis } = require("../../../infra/redis");

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

async function getCacheTimezone(guild_id) {
	return await redis.get(`${guild_id}:timezone`);
}

async function setCacheTimezone(guild_id, timezone) {
	await redis.set(`${guild_id}:timezone`, timezone, { EX: 600 });
	return true;
}

async function checkTimezone(guild_id) {
	let currentTimezone = await getCacheTimezone(guild_id);
	let cached = true;
	if (!currentTimezone) {
		currentTimezone = await getTimezone(guild_id);
		cached = false;

		if (!currentTimezone) {
			setTimezone(guild_id, "America/Sao_Paulo");
			return "America/Sao_Paulo";
		}

		setCacheTimezone(guild_id, currentTimezone);
	}

	console.log(`Timezone check:\nCached: ${cached}\nCurrentTimezone: ${currentTimezone}`);

	return currentTimezone;
}

module.exports = {
	setTimezone,
	checkTimezone,
};
