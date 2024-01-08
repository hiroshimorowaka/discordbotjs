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


    run: async({interaction}) => {
      
      await interaction.reply('Configuring your server...');

      const result = await registerGuild(interaction.guildId);


      await interaction.editReply('Start setup was made with success!');

    },
  requiredPermissions: [PermissionsBitField.Flags.ManageGuild,PermissionsBitField.Flags.Administrator],
  timeout: commandTimeout
};
