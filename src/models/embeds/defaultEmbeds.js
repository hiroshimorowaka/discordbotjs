const { EmbedBuilder } = require("discord.js");

const errorEmbed = new EmbedBuilder()
  .setTitle(":x: An error ocurred!")
  .setColor(16722499);

module.exports = {
  errorEmbed,
};
