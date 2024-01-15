const status = require("../../../status.json");

module.exports = (client) => {
	if (status.length > 1) {
		setInterval(() => {
			const random = Math.floor(Math.random() * status.length);
			client.user.setActivity(status[random]);
		}, 15 * 1000);
	} else {
		client.user.setActivity(status[0]);
	}
};
