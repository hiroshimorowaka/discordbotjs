const pino = require("../../../logger");
const { query } = require("../../../infra/database");

async function setLogChannel(channelId, guildId) {
	return await query(
		"UPDATE logs SET channels = array_append(logs.channels,$2) WHERE logs.guild_id = $1;",
		[guildId, channelId],
	);
}

async function LogChannelExists(channelId, guildId) {
	const result = await query("SELECT * FROM logs WHERE guild_id = $1", [
		guildId,
	]);
	const channels = result.rows[0]?.channels;
	if (channels) {
		return channels.includes(channelId);
	}
	return false;
}
module.exports = {
	setLogChannel,
	LogChannelExists,
};
