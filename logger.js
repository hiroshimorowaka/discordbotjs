const { format } = require("date-fns");

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
	timeZone: "America/Sao_Paulo",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	timeZoneName: "shortOffset",
});
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
