function getDateFormater(serverLocale, timezone) {
	const warnFormatedDate = new Intl.DateTimeFormat(serverLocale, {
		timeZone: timezone,
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "shortOffset",
	});
	return warnFormatedDate;
}

module.exports = {
	getDateFormater,
};
