const ms = require('ms-prettify').default

module.exports = (interaction, commandObj,_,client) => {
  client.cooldowns.set(`${interaction.user.id}_${commandObj.name}`, Date.now() + (commandObj.timeout || 0));
}