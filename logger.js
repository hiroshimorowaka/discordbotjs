const pino = require('pino')({
  level: 'trace',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
        }
      },
      {
        target: 'pino/file',
        options: { destination: `${__dirname}/app.log` },
      },
    ],
  },

  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
})

module.exports = pino