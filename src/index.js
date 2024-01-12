require('dotenv/config');

const { Client, IntentsBitField, Collection } = require('discord.js')
const { CommandKit } = require('commandkit')
const path = require('path')

const {testServers, devs} = require('../config.json')
const commandsPath = path.join(__dirname,'commands')
const validationsPath = path.join(__dirname,'validations')
const eventsPath = path.join(__dirname,'events')

const status = require("../status.json");

const client = new Client({intents: [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
]});

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


client.on('interactionCreate', async (interaction) => {
  // const commands = (await client.application.commands.fetch())
  // commands.forEach((command) => {
  //   console.log(command.name)
  // }); // usar pra mostrar os comandos no /help
})


//Discord bot custom status
client.on("ready", () => {

  if(status.length > 1){
    setInterval(() => {
      let random = Math.floor(Math.random() * status.length);
      client.user.setActivity(status[random])
    }, 15 * 1000);
  }else{
    client.user.setActivity(status[0]);
  }



})

client.login(process.env.BOT_TOKEN)

