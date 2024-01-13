const msPretty = require("ms-prettify").default;

const punish = {
	1: {
		name: "kick",

		run: (userSelectedObj, reason) => {
			userSelectedObj.kick(reason);
			return `${userSelectedObj} has been \`kicked\`! (exceed max warns)`;
		},
	},
	2: {
		name: "ban",

		run: (userSelectedObj, reason) => {
			userSelectedObj.ban({ reason: `Max warn limit -> Reason: ${reason}` });
			return `${userSelectedObj} has been \`banned\`! (exceed max warns)`;
		},
	},
	3: {
		name: "timeout",

		run: (userSelectedObj, reason, time) => {
			userSelectedObj.timeout(time, reason);
			return `${userSelectedObj} has been \`timed out\` for **${msPretty(
				time,
			)}**! (exceed max warns)`;
		},
	},
};

module.exports = {
	punish,
};
