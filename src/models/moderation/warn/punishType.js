const msPretty = require("ms-prettify").default;

const punish = {
	1: {
		name: "kick",

		run: async (userSelectedObj, reason, locale) => {
			await userSelectedObj.kick(reason);
			const kickLocales = {
				"pt-BR": `O usuário ${userSelectedObj} foi \`kickado\`! (Excedeu o maximo de advertências)`,
				"en-US": `${userSelectedObj} has been \`kicked\`! (exceed max warns)`,
			};
			return kickLocales[locale] || kickLocales["en-US"];
		},
	},
	2: {
		name: "ban",

		run: async (userSelectedObj, reason, locale) => {
			await userSelectedObj.ban({ reason: `Max warn limit -> Reason: ${reason}` });

			const banLocales = {
				"pt-BR": `O usuário ${userSelectedObj} foi \`banido\`! (Excedeu o maximo de advertências)`,
				"en-US": `${userSelectedObj} has been \`banned\`! (exceed max warns)`,
			};

			return banLocales[locale] || banLocales["en-US"];
		},
	},
	3: {
		name: "timeout",

		run: async (userSelectedObj, reason, time, locale) => {
			await userSelectedObj.timeout(time, reason);

			const timeoutLocales = {
				"pt-BR": `O usuário ${userSelectedObj} tomou \`timeout\` por **${msPretty(
					time,
				)}**! (Excedeu o maximo de advertências)`,
				"en-US": `${userSelectedObj} has been \`timed out\` for **${msPretty(time)}**! (exceed max warns)`,
			};
			return timeoutLocales[locale] || timeoutLocales["en-US"];
		},
	},
};

module.exports = {
	punish,
};
