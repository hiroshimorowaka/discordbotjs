const {
  SlashCommandBuilder,
  PermissionsBitField
} = require("discord.js");

const {registerGuild} = require('../../models/guilds/guildRegistering');
const commandTimeout = 7000
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the BOT to work on your server"),

/**
 * @param {import('commandkit').SlashCommandProps} param0 
 */
    run: async({interaction}) => {

      await interaction.reply('Configuring your server...');

      const result = await registerGuild(interaction.guildId);


      await interaction.editReply('Start setup was made with success!');

    },
  options: {
    userPermissions: ['ManageGuild'],
    timeout: commandTimeout
  }

};
