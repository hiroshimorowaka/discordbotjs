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
	const startTime = performance.now();
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

	const endTime = performance.now();

	if (process.env.DEBUG) {
		console.log(
			`Timezone check:\nTime${(endTime - startTime).toFixed(
				2,
			)}ms\nCached: ${cached}\nCurrentTimezone: ${currentTimezone}`,
		);
	}

	return currentTimezone;
}

module.exports = {
	setTimezone,
	checkTimezone,
};
