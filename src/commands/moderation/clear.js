const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const {sendLogs} = require('../../models/logs/sendLogs');
const pino = require('../../../logger');

const maxValue = 500
const commandTimeout = 5000
module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete X messages from chat")
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`Amount of messages to be deleted (Limit: ${maxValue}) `)
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(maxValue),
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Delete specified user messages!"),
    ),

/**
 * @param {import('commandkit').SlashCommandProps} param0 
 */

    run: async({interaction}) => {

    const { options, channel } = interaction;
    let amount = options.getInteger("amount");
    const target = options.getUser("target");
    const multiMessages = amount === 1 ? "message" : "messages";

    if (!amount || amount > maxValue || amount < 1) {
      return await interaction.reply({
        content: `Please specify an amount between 1 and ${maxValue}`,
        ephemeral: true,
      });
    }

    try {
      const channelMessages = await channel.messages.fetch();

      if (channelMessages.size === 0) {
        return await interaction.reply({
          content: "There are no messages in this channel to delete!",
          ephemeral: true,
        });
      }

      if (amount > channelMessages.size) amount = channelMessages.size;

      const clearEmbed = new EmbedBuilder().setColor(0x36d63b);

      await interaction.deferReply({ ephemeral: true });

      let messagesToDelete = [];

      if (target) {
        let i = 0;
        channelMessages.forEach((m) => {
          if (m.author.id === target.id && messagesToDelete.length < amount) {
            messagesToDelete.push(m);
            i++;
          }
        });
        clearEmbed.setDescription(`
              \`✅\` Successfully cleared \`${messagesToDelete.length}\` ${multiMessages} from ${target} in ${channel}.
            `);
      } else {
        messagesToDelete = channelMessages.first(amount);
        clearEmbed.setDescription(`
          \`✅\` Successfully cleared \`${messagesToDelete.length}\` ${multiMessages} in ${channel}.
        `);
      }

      if (messagesToDelete.length > 0) {
        console.log(messagesToDelete)
        await channel.bulkDelete(messagesToDelete, true);
      }

      // Send log
      sendLogs(interaction)
      return await interaction.editReply({ embeds: [clearEmbed] });

    } catch (e) {
      await interaction.followUp({
        content: "An error occurred when executing this command!",
        ephemeral: true,
      });
      pino.error(e);
    }
  },
  options: {
    userPermissions: ['ManageGuild'],
    botPermissions: ['ManageMessages'],
    timeout: commandTimeout
  }

};
