const { query } = require("../../../infra/database");

async function registerGuild(guild_id, client) {
	await query("INSERT INTO banned_words (guild_id) VALUES($1) ON CONFLICT (guild_id) DO NOTHING;", [
		guild_id,
	]);
	await query(
		"INSERT INTO warn_config (guild_id,max_warns,punishment_type,timeout_duration) VALUES($1,$2,$3,$4) ON CONFLICT (guild_id) DO NOTHING;",
		[guild_id, 0, 0, 0],
	);
	await query(
		"INSERT INTO guild_config (guild_id,locale,timezone) VALUES($1,$2,$3) ON CONFLICT (guild_id) DO NOTHING;",
		[guild_id, "en-US", "America/Sao_Paulo"],
	);

	return true;
}

async function unregisterGuild(guild_id) {
	await query("DELETE FROM banned_words WHERE guild_id = $1;", [guild_id]);
	await query("DELETE FROM warn_config WHERE guild_id = $1;", [guild_id]);
	await query("DELETE FROM guild_config WHERE guild_id = $1;", [guild_id]);
	return true;
}

module.exports = {
	registerGuild,
	unregisterGuild,
};
