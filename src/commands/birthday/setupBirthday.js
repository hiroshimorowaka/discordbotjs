const {
  SlashCommandBuilder,
} = require("discord.js");

const pino = require('../../../logger')

const {SetBirthday} = require('../../models/birthday/birthday')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Set your birthday")
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Set your date to retrive later! (FORMAT: dd/MM/yyyy)")
        .setRequired(true),
    ),
  run: async ({interaction}) => {
    try {
      const user_id = interaction.user.id;
      const date = interaction.options.get("date").value.replace(/ /g, "");

      const new_date = validateDate(date);
      if (new_date) {
        await SetBirthday(user_id, new_date);
        return await interaction.reply({
          content: "Your birthday has been set successfully!",
          ephemeral: true,
        });
      } else {
        return await interaction.reply({
          content: "You have entered an INVALID date!",
          ephemeral: true,
        });
      }
    } catch (e) {
      pino.error(e);
      return await interaction.reply({ content: 'An error ocurred when setting your birthday!', ephemeral: true});
    }
  },
};