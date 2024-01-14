const { query } = require("../../../infra/database");
const { getLocaleCache, setLocaleCache } = require("../../../infra/redis");

async function setGuildLocaleDatabase(guild_id, locale) {
	await query("UPDATE guild_config SET locale = $2 WHERE guild_id = $1", [guild_id, locale]);
	return true;
}

async function getGuildLocaleDatabase(guild_id) {
	const result = await query("SELECT locale FROM guild_config WHERE guild_id = $1", [guild_id]);
	return result.rows[0]?.locale;
}

async function checkGuildLocale(guild_id) {
	let currentLocale = await getLocaleCache(guild_id);

	if (!currentLocale) {
		currentLocale = await getLocaleDatabase(guild_id);

		if (!currentLocale) {
			setLocaleDatabase(guild_id, "pt-BR");
			return "pt-BR";
		}

		setLocaleCache(guild_id, currentLocale);
	}
	return currentLocale;
}

module.exports = {
	setGuildLocaleDatabase,
	getGuildLocaleDatabase,
	checkGuildLocale,
};
