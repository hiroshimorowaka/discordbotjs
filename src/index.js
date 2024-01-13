require("dotenv/config");

const { Client, IntentsBitField, Collection } = require("discord.js");
const { CommandKit } = require("commandkit");
const path = require("path");

const { testServers, devs } = require("../config.json");
const commandsPath = path.join(__dirname, "commands");
const validationsPath = path.join(__dirname, "validations");
const eventsPath = path.join(__dirname, "events");

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

client.cooldowns = new Collection();

new CommandKit({
	client,
	devGuildIds: testServers,
	devUserIds: devs,
	commandsPath,
	validationsPath,
	eventsPath,
	bulkRegister: true,
});

client.login(process.env.BOT_TOKEN);
