const { EmbedBuilder } = require("discord.js");

const errorEmbed = new EmbedBuilder().setTitle(":x: An error ocurred!").setColor(16722499);

const warnEmbed = new EmbedBuilder().setTitle("⚠️ Warning!").setColor(14397952);

module.exports = {
	errorEmbed,
	warnEmbed,
};
