const {sendBotCommandLog} = require('../../models/logs/bot/botCommandsLog');

const {Interaction,Client} = require('discord.js');
/**
 * @param {Interaction} interaction 
 * @param {Client} client 
 */

module.exports = (interaction,client) => {

  const options = interaction.options._hoistedOptions;

  sendBotCommandLog(interaction, client, options);
}