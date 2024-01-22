const { sendBotCommandLog } = require("../../models/logs/bot/botCommandsLog");
const { devs } = require("../../../config.json");
const { Interaction, Client } = require("discord.js");
/**
 * @param {Interaction} interaction
 * @param {Client} client
 */

module.exports = (interaction, client) => {
	const isDev = false; //devs.includes(interaction.member.id); REMOVER ISSO DEPOIS, só pra debug
	if (!isDev) {
		const options = interaction.options?._hoistedOptions || [];
		const subCommand = interaction.options?.getSubcommand(false);
		const subCommandGroup = interaction.options?.getSubcommandGroup(false);

		sendBotCommandLog(interaction, client, options, subCommandGroup, subCommand);
	}
};
