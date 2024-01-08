require('dotenv/config');

const { Client, IntentsBitField, Collection } = require('discord.js')
const { CommandHandler } = require('djs-commander')
const path = require('path')

const client = new Client({intents: [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
]});
client.cooldowns = new Collection();

const {testServer} = require('../config.json')
const commandsPath = path.join(__dirname,'commands')
const validationsPath = path.join(__dirname,'validations')
const eventsPath = path.join(__dirname,'events')
new CommandHandler({
  client,
  commandsPath,
  testServer,
  validationsPath,
  eventsPath
});

client.login(process.env.BOT_TOKEN)

