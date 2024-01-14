const pino = require("../../../logger");
const { query } = require("../../../infra/database");

const { Guild } = require("discord.js");
/**
 * @param {Guild} guild
 */

module.exports = async (guild) => {
	const result = await query(
		"SELECT reason,guild_id FROM banned_guilds WHERE guild_id = $1 AND banned = 1;",
		[guild.id],
	);

	if (result.rowCount > 0) {
		const ownerId = guild.ownerId;
		const owner = guild.members.cache.get(ownerId) || (await guild.members.fetch(ownerId));
		await owner.send(
			`Your guild \`${guild.name}\` (${guild.id}) has been banned from using this BOT\n**Reason:** ${result.rows[0].reason}`,
		);

		await guild.leave();
		return true;
	}
};
