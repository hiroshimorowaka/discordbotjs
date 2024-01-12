const { SlashCommandBuilder } = require("discord.js");
const commandTimeout = 3000


module.exports = {
  data: new SlashCommandBuilder()
  .setName('speak')
  .setDescription('I will tts your message!')
  .addStringOption((option)=>
    option
    .setName('text')
    .setDescription('Enter the text and I will tts it')
    .setRequired(true)
  ),
/**
 * @param {import('commandkit').SlashCommandProps} param0 
 */
  run: async ({interaction}) => {

    const text = interaction.options.getString('text');

    interaction.reply({content: `${text}`, tts: true});
  },
  options: {
    timeout: commandTimeout
  }
  }