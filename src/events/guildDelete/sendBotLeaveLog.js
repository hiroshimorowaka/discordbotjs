const pino = require("../../../logger");
const { sendBotGuildLeaveLog } = require("../../models/logs/bot/botGuildLeaveLog");

const { Guild } = require("discord.js");

/**
 * @param {Guild} guild
 */

module.exports = async (guild, client) => {
	sendBotGuildLeaveLog(guild, client);
};
