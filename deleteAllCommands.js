require('dotenv/config')

const { REST, Routes } = require('discord.js');
const { BOT_TOKEN, BOT_ID, GUILD_ID } = process.env

const rest = new REST().setToken(BOT_TOKEN);

// ...

// for guild-based commands

rest.put(Routes.applicationGuildCommands(BOT_ID, GUILD_ID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);