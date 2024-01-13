require("dotenv/config");

const { REST, Routes } = require("discord.js");
const { BOT_TOKEN, BOT_ID, GUILD_ID } = process.env;

const rest = new REST().setToken(BOT_TOKEN);

// ...

// for guild-based commands

rest
  .put(Routes.applicationCommands(BOT_ID), { body: [] })
  .then(() => console.log("Successfully deleted all global commands."))
  .catch(console.error);
