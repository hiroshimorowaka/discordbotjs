const pino = require("../../../logger");

const { Client } = require("discord.js");
/**
 * @param {Client} client
 * @returns
 */

module.exports = (client) => {
	pino.info(`${client.user.username} is ready! | Version: 3.0.0`);
};
