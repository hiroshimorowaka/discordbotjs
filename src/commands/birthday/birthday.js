const { SlashCommandBuilder } = require("discord.js");

const pino = require("../../../logger");

const {
  commandSetBirthday,
  commandListBirthdays,
} = require("../../models/birthday/birthday");

const commandTimeout = 5000
module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Birthday settings")
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
  run: async ({ interaction,client }) => {
    const subCommand = interaction.options.getSubcommand();

    if(subCommand === "list"){
      await commandListBirthdays(interaction,client);
    }
    if(subCommand === "set"){
      await commandSetBirthday(interaction);
    }

    client.timeout.set(`${interaction.user.id}_${interaction.commandName}`,Date.now() + (commandTimeout))
  },

  timeout: commandTimeout

};
