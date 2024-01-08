const { SlashCommandBuilder } = require("discord.js");
const commandTimeout = 3000
module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Reply Pong foda demais!'),

  run: async ({client,interaction}) => {

    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    
    interaction.editReply(
      `Bot Latency: ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms`,
    );
  },

  timeout: commandTimeout
  }

