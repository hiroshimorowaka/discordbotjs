const {
  SlashCommandBuilder
} = require("discord.js");

const {setTimeout, removeTimeout} = require('../../models/moderation/mTimeout');

const commandTimeout = 3000
module.exports = {

  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user.")
    .setDMPermission(false)

    .addSubcommand((subCommand) => 
    subCommand
      .setName('set')
      .setDescription('Set timeout for a user!')
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to be timed out")
            .setRequired(true)
          )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("The duration of time out (5s, 30m, 1h, 1 day)")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the time out!"),
        )
    )
    .addSubcommand((subCommand) => 
    subCommand
      .setName('remove')
      .setDescription('Set timeout for a user!')
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove timeout")
            .setRequired(true)
          )
    )
,

/**
 * @param {import('commandkit').SlashCommandProps} param0 
 */
    run: async({interaction}) => {
      
      const subCommand = interaction.options.getSubcommand();
      
      if(subCommand === 'set'){
      await setTimeout(interaction);
      return
      }
      
      if(subCommand === 'remove'){
        await removeTimeout(interaction)
        return
      }
    },
    options: {
      userPermissions: ['MuteMembers'],
      botPermissions: ['MuteMembers'],
      timeout: commandTimeout
    }
};
