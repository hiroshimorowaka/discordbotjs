const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const {setLogChannel,LogChannelExists} = require('../../models/logs/setLogsChannels')
const pino = require('../../../logger')

const commandTimeout = 5000
module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Set logs channels")
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send logs!")
        .setRequired(true)
    ),
/**
 * @param {import('commandkit').SlashCommandProps} param0 
 */
    run: async({interaction}) => {
        await interaction.deferReply();
        const {options,guildId} = interaction
        const channelId = options.get('channel').value;
        console.log(channelId)
        try {
             const result = await LogChannelExists(channelId,guildId);
             if(result){
              await interaction.editReply('This channel already has been seted!');
              return
             } 
             
             await setLogChannel(channelId,guildId)
             await interaction.editReply('Channel set successfully!');
        } catch (error) {
          pino.error(error)
        }
    },
    options: {
      timeout: commandTimeout,
      userPermissions: ['ManageChannels','ManageGuild']
    }
};
