require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js')
const { CommandHandler } = require('djs-commander')
const client = new Client({intents: [IntentsBitField.Flags.Guilds]});
const path = require('path')

new CommandHandler({
  client: client,
  commandsPath: path.join(__dirname,'commands'),
  testServer: '1161392391958315119',
  validationsPath: path.join(__dirname,'validations'),
  eventsPath: path.join(__dirname,'events')
});


client.login(process.env.BOT_TOKEN)