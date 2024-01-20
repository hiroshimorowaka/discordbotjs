const { query } = require("../../../../infra/database");

async function setBanConfig(guild_id, announce, announce_channel, embedTitle, embedDescription) {
	const result = await query(
		"INSERT INTO ban_config (guild_id,announce,announce_channel,announce_embed_title,announce_embed_description) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (guild_id) DO UPDATE SET (announce,announce_channel,announce_embed_title,announce_embed_description) = ($2,$3,$4,$5);",
		[guild_id, announce, announce_channel, embedTitle, embedDescription],
	);

	return result.rowCount;
}

async function setBanAnnouncement(guild_id, announce) {
	const result = await query("UPDATE ban_config SET announce = $2 WHERE guild_id = $1;", [
		guild_id,
		announce,
	]);

	return result.rowCount;
}

async function getBanConfig(guild_id) {
	const result = await query("SELECT * FROM ban_config WHERE guild_id = $1", [guild_id]);

	return result.rows[0];
}

module.exports = {
	setBanConfig,
	getBanConfig,
	setBanAnnouncement,
};
