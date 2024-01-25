const pino = require("../../../logger");
const { unregisterGuild } = require("../../models/guilds/guildRegistering");

const { Guild } = require("discord.js");
/**
 * @param {Guild} guild
 * @returns
 */

module.exports = async (guild) => {
	pino.info(`Bot as removed from ${guild.id} | ${guild.name} | Deleting from database...`);
	try {
		await unregisterGuild(guild.id);
		pino.info(`Guild deleted! ${guild.id} | ${guild.name}`);
	} catch (error) {
		pino.error(`Error when deleting guild from database: ${error}`);
	}
};
