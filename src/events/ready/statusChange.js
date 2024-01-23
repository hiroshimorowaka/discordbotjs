const status = require("../../../status.json");
const { Client } = require("discord.js");
/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
	let guildCount = client.guilds.cache.get() || (await client.guilds.fetch());

	setInterval(async () => {
		guildCount = client.guilds.cache.get() || (await client.guilds.fetch());
	}, 60000);

	if (status.length > 1) {
		setInterval(() => {
			const random = Math.floor(Math.random() * status.length);

			client.user.setActivity(status[random].replace("{guildcount}", guildCount));
		}, 15 * 1000);
	} else {
		client.user.setActivity(status[0].replace("{guildcount}", guildCount));
	}
};
