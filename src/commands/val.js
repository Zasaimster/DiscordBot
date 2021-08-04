const {getValStats} = require('../scrapers/valScraper');

const handleValRequest = async (cmd, ign) => {
	if (cmd === 'help') {
		console.log('help');
		let commands =
			'-val stats, -val damagePerRound, -val kd, -val kad, -val last20acc, -val last20, -val hs%, -val win%, -val topAgentInfo, -val top3AgentsInfo, -val topAgent, -val top3Agents, -val tracker, -val topWeapons, -val topWeaponsInfo';

		return commands;
	}

	//const res = await getValStats(args);
	//const stats = res.data.data[0].stats;
	if (res.status !== 200) {
		return res.status;
	}

	if (cmd === 'stats') {
		//figure this one out
		//return res[0].stats;
		return 'work in progress';
	}
	if (cmd === 'damagePerRound') {
		return stats.damagePerRound.displayValue;
	}
	if (cmd === 'kd') {
		return stats.kDRatio.displayValue;
	}
	if (cmd === 'kad') {
		return stats.kADRatio.displayValue;
	}
	if (cmd === 'last20acc') {
		return 'work in progress';
	}
	if (cmd === 'last20') {
		return 'work in progress';
	}
	if (cmd === 'hs%') {
		return `${stats.headshotsPercentage.displayValue}%`;
	}
	if (cmd === 'win%') {
		return stats.matchesWinPct.displayValue;
	}
	if (cmd === 'topAgentInfo') {
		return 'work in progress';
	}
	if (cmd === 'top3AgentsInfo') {
		return 'work in progress';
	}
	if (cmd === 'topAgent') {
		return 'work in progress';
	}
	if (cmd === 'top3Agents') {
		return 'work in progress';
	}
	if (cmd === 'tracker') {
		return `https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(args))}/overview`;
	}
	if (cmd === 'topWeapons') {
		//use puppeteer and cheerio to get that info since there's no fetch request that I can access for that info
		return 'work in progress';
	}
	if (cmd === 'topWeaponsInfo') {
		return 'work in progress';
	}
};

exports.handleValRequest = handleValRequest;
