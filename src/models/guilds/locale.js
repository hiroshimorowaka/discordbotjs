const { query } = require("../../../infra/database");
const { getGuildLocaleCache, setGuildLocaleCache } = require("../../../infra/redis");

async function setGuildLocaleDatabase(guild_id, locale) {
	await query("UPDATE guild_config SET locale = $2 WHERE guild_id = $1", [guild_id, locale]);
	return true;
}

async function getGuildLocaleDatabase(guild_id) {
	const result = await query("SELECT locale FROM guild_config WHERE guild_id = $1", [guild_id]);
	return result.rows[0]?.locale;
}

async function checkGuildLocale(guild_id) {
	let currentLocale = await getGuildLocaleCache(guild_id);
	let cached = true;
	if (!currentLocale) {
		currentLocale = await getGuildLocaleDatabase(guild_id);
		cached = false;

		if (!currentLocale) {
			setGuildLocaleDatabase(guild_id, "pt-BR");
			return "pt-BR";
		}

		setGuildLocaleCache(guild_id, currentLocale);
	}
	// console.log(`Locale: ${currentLocale || "pt-BR"}\nCached: ${cached}`);

	return currentLocale;
}

module.exports = {
	setGuildLocaleDatabase,
	getGuildLocaleDatabase,
	checkGuildLocale,
};
