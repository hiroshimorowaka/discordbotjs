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
  destination: '/log/file'
})

module.exports = pino