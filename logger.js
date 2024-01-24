const { getDateFormater } = require("./src/models/dateFormater");

const dateFormat = getDateFormater("pt-BR", "America/Sao_Paulo");
const pino = require("pino")({
	level: "debug",
	transport: {
		targets: [
			{
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			},
			{
				target: "pino/file",
				options: { destination: `${__dirname}/app.log` },
			},
		],
	},
	timestamp: () => `,"time":"${dateFormat.format(new Date(Date.now()))}"`,
	// timestamp: () => `,"time":"${format(new Date(Date.now()), "dd/MM H:mm:ss.SS")}"`,
});

module.exports = pino;
