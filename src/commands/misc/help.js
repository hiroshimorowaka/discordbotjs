const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const commandTimeout = 3000



module.exports = {
  data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show all commands and their description!'),

/**
 * @param {import('commandkit').SlashCommandProps} param0 
 * @param {import('discord.js').Client} param1 
 */

  run: async ({interaction,client}) => {
  const embed = new EmbedBuilder()
  .setTitle('List of all commands!');
  const descriptionOfEmbed = []

  await interaction.deferReply();
  
  const commands = (await client.application.commands.fetch())
 
  commands.forEach((command) => {
      const newString = `\`/${command.name.toUpperCase()}:\` ${command.description}\n`;
      descriptionOfEmbed.push(newString);
    }); 
  

    embed.setDescription(descriptionOfEmbed.join(' '));
    interaction.editReply({embeds: [embed]});
  },
  options: {
    timeout: commandTimeout
  }
  }

