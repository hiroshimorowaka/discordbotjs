const {format} = require('date-fns')

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

  timestamp: () => `,"time":"${format(new Date(Date.now()),'dd/MM H:mm:ss.SS')}"`,
})

module.exports = pino