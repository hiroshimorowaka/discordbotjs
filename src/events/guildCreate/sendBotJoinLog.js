const pino = require("../../../logger");
const { sendBotGuildJoinLog } = require("../../models/logs/bot/botGuildJoinLog");

const { Guild } = require("discord.js");

/**
 * @param {Guild} guild
 */

module.exports = async (guild, client) => {
	sendBotGuildJoinLog(guild, client);
};
