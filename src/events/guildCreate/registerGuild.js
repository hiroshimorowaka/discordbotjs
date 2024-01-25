const pino = require("../../../logger");
const { registerGuild } = require("../../models/guilds/guildRegistering");
const { errorEmbed } = require("../../models/embeds/defaultEmbeds");
const { Guild } = require("discord.js");
/**
 * @param {Guild} guild
 * @returns
 */

module.exports = async (guild) => {
	pino.info(`Bot has invited to new guild ${guild.id} ${guild.name} | Creating this guild on database`);

	try {
		await registerGuild(guild.id);
		pino.info(`Guild registered! ${guild.id} | ${guild.name}`);
	} catch (error) {
		pino.error(`Error when registering guild on database: ${error}`);
		const owner = await guild.fetchOwner();
		errorEmbed.setDescription(
			`I failed to register your server! Please use \`/setup\` in your guild to set up the bot.\nIf it doesn't work, contact Hiroshi's BOT TEAM`,
		);
		owner.send({ embeds: [errorEmbed] }).catch(() => {});
	}

	try {
		await registerGuild(guild.id, guild.client);
	} catch (error) {}
};
