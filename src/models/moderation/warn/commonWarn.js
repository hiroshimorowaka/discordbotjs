const { query } = require("../../../../infra/database");

async function checkIfGuildIsConfigurated(guild_id) {
	const maxWarnsConfig = await query("SELECT * FROM warn_config WHERE guild_id = $1", [guild_id]);
	const maxWarns = maxWarnsConfig.rows[0]?.max_warns;
	const punishment_type = maxWarnsConfig.rows[0]?.punishment_type;

	if (!maxWarns || !punishment_type || punishment_type === 0) {
		return false;
	}

	return true;
}

async function checkUserWarns(guild_id, user_id) {
	const result = await query("SELECT * FROM warns WHERE guild_id = $1 AND user_id = $2", [guild_id, user_id]);

	const maxWarnsConfig = await query("SELECT * FROM warn_config WHERE guild_id = $1", [guild_id]);
	const maxWarns = maxWarnsConfig.rows[0]?.max_warns;
	const punishment_type = maxWarnsConfig.rows[0]?.punishment_type;
	const timeout_duration = maxWarnsConfig.rows[0]?.timeout_duration || 0;
	const count = result.rowCount;

	return { count, maxWarns, punishment_type, timeout_duration };
}

module.exports = {
	checkUserWarns,
	checkIfGuildIsConfigurated,
};
