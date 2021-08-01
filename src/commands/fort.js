const {convertPRToReadableString, prettifyFNStats} = require('../helper/functions');
const getFnStats = require('../scrapers/fnScraper');

const handleFnRequest = async (cmd, args) => {
	const stats = await getFnStats(args);
	if (stats.status !== undefined && stats.status !== 200) {
		return stats.status;
	}

	switch (cmd) {
		case 'Stats':
			return prettifyFNStats(stats);
		case 'Pr':
			return convertPRToReadableString(stats.points);
		case 'Earnings':
			return `$${stats.cashPrize}`;
		case 'Events':
			return stats.events;
		case 'Tracker':
			return `https://fortnitetracker.com/profile/all/${encodeURI(args)}/events`;
		default:
			return 'Error handling your request?? idk';
	}
};

exports.handleFnRequest = handleFnRequest;
