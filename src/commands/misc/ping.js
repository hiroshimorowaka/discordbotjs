const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const commandTimeout = 3000
module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Reply Pong foda demais!'),

  run: async ({interaction}) => {

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
  botPermissions: [PermissionsBitField.Flags.Administrator],
  timeout: commandTimeout
  }

