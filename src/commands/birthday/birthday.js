const { SlashCommandBuilder,Interaction,Client } = require("discord.js");

const pino = require("../../../logger");

const {
  commandSetBirthday,
  commandListBirthdays,
} = require("../../models/birthday/birthday");

/**
 * @param {Interaction} interaction 
 * @param {Client} client 
 * @returns 
 */

const commandTimeout = 5000
module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Birthday settings")
    .setDMPermission(false)
      .addSubcommand((subCommand) =>
        subCommand
        .setName("set")
        .setDescription("Set your birthday!")
        .addStringOption((option) =>
        option
          .setName("date")
          .setDescription("Set your date to retrive later! (FORMAT: dd/MM/yyyy)")
          .setRequired(true),
      )
    )
    .addSubcommand((subCommand) =>
        subCommand
        .setName("list")
        .setDescription("Lists all the server's birthdays!")
    ),

/**
 * @param {import('commandkit').SlashCommandProps} param0 
 * @param {import('commandkit').SlashCommandProps} param1
 */
  run: async ({ interaction,client }) => {
    const subCommand = interaction.options.getSubcommand();

    if(subCommand === "list"){
      await commandListBirthdays(interaction,client);
    }
    if(subCommand === "set"){
      await commandSetBirthday(interaction);
    }
  },
  options: {
    timeout: commandTimeout
  }
};
