const { SlashCommandBuilder,PermissionsBitField } = require("discord.js");
const {
  removeBlacklistWord,
  addBlacklistWord,
  listBlacklistWords,
} = require("../../models/blacklist/blacklist");


const commandTimeout = 2000
module.exports = {
  data: new SlashCommandBuilder()
  .setName("blacklist")
  .setDescription("Blacklist manager!")

  .addSubcommandGroup((subcommandgroup) =>
    subcommandgroup
      .setName("words")
      .setDescription("Blacklist words from chat")
      .addSubcommand((subCommand) =>
        subCommand
          .setName("add")
          .setDescription("Add a new blacklist word")
          .addStringOption((option) =>
            option
              .setName("word")
              .setDescription("The word you want to block from channels")
              .setRequired(true),
          ),
      )
      .addSubcommand((subCommand) =>
        subCommand
          .setName("remove")
          .setDescription("remove a new blacklist word")
          .addStringOption((option) =>
            option
              .setName("word")
              .setDescription("The word you want to block from channels")
              .setRequired(true),
          ),
      )
      .addSubcommand((subCommand) =>
        subCommand.setName("list").setDescription("List words blacklisted"),
      ),
  ),

  run: async ({interaction, client}) => {
    const subCommand = interaction.options.getSubcommand();
    const subCommandGroup = interaction.options.getSubcommandGroup();
    if (subCommandGroup === "words") {
      if (subCommand === "list") {

          await listBlacklistWords(interaction, client);
          
      }
      if (subCommand === "add") {

          await addBlacklistWord(interaction, client);

      }
      if (subCommand === "remove") {

        await removeBlacklistWord(interaction, client);

      }
    }
  },
  requiredPermissions: [PermissionsBitField.Flags.ManageGuild,PermissionsBitField.Flags.Administrator],
  timeout: commandTimeout
}
