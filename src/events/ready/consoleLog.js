const pino = require('../../../logger');

module.exports = (client) => {
  pino.info(`${client.user.username} is ready!`)
}