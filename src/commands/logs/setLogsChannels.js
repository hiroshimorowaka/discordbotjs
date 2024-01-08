const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  Interaction
} = require("discord.js");

const {setLogChannel,LogChannelExists} = require('../../models/logs/setLogsChannels')
const pino = require('../../../logger')
/**
 * @param {Interaction} interaction 
 * @returns 
 */

const commandTimeout = 5000
module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Set logs channels")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send logs!")
        .setRequired(true)
    ),
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
  requiredPermissions: [PermissionsBitField.Flags.ManageMessages,PermissionsBitField.Flags.Administrator],
  timeout: commandTimeout
};
