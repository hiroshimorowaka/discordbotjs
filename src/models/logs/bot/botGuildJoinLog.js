const { Guild, Client, EmbedBuilder } = require("discord.js");
const { logs } = require("../../../../config.json");
/**
 *
 * @param {Guild} guild
 * @param {Client} client
 */
async function sendBotGuildJoinLog(guild, client) {
	const logEmbed = new EmbedBuilder()
		.setTitle("Acabei de entrar em uma guilda!")
		.addFields(
			{ name: "Nome da guilda:", value: `${guild.name} ||${guild.id}||` },
			{ name: "Membros:", value: `${guild.memberCount}` },
			{ name: "Dono:", value: `<@${guild.ownerId}> ||${guild.ownerId}||` },
		);

	if (logs.guildid && logs.commandLogs) {
		const guild = client.guilds.cache.get(logs.guildid) || (await client.guilds.fetch(logs.guildid));
		const channel = guild.channels.cache.get(logs.joinGuildLogs) || (await guild.channels.fetch(logs.joinGuildLogs));
		
    if (guild && channel) {
			channel.send({ embeds: [logEmbed] })
		}
	}
}

module.exports = {
	sendBotGuildJoinLog,
};
