const getValStats = require('../scrapers/valScraper');

const handleValRequest = async (cmd, args) => {
	console.log(cmd);
	if (cmd === 'Help') {
		console.log('help');
		let commands =
			'valStats, valDamagePerRound, valKD, valKAD, valLast20Acc, valLast20, valHS%, valWin%, valTopAgentInfo, valTop3AgentsInfo, valTopAgent, valTop3Agents, valTracker, valTopWeapons, valTopWeaponsInfo';
		return commands;
	}

	const res = await getValStats(args);
	const stats = res.data.data[0].stats;
	if (res.status !== 200) {
		return res.status;
	}

	if (cmd === 'Stats') {
		//figure this one out
		//return res[0].stats;
		return 'work in progress';
	}
	if (cmd === 'DamagePerRound') {
		return stats.damagePerRound.displayValue;
	}
	if (cmd === 'KD') {
		return stats.kDRatio.displayValue;
	}
	if (cmd === 'KAD') {
		return stats.kADRatio.displayValue;
	}
	if (cmd === 'Last20Acc') {
		return 'work in progress';
	}
	if (cmd === 'Last20') {
		return 'work in progress';
	}
	if (cmd === 'HS%') {
		return `${stats.headshotsPercentage.displayValue}%`;
	}
	if (cmd === 'Win%') {
		return stats.matchesWinPct.displayValue;
	}
	if (cmd === 'TopAgentInfo') {
		return 'work in progress';
	}
	if (cmd === 'Top3AgentsInfo') {
		return 'work in progress';
	}
	if (cmd === 'TopAgent') {
		return 'work in progress';
	}
	if (cmd === 'Top3Agents') {
		return 'work in progress';
	}
	if (cmd === 'Tracker') {
		return `https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(args))}/overview`;
	}
	if (cmd === 'TopWeapons') {
		//use puppeteer and cheerio to get that info since there's no fetch request that I can access for that info
		return 'work in progress';
	}
	if (cmd === 'TopWeaponsInfo') {
		return 'work in progress';
	}
};

exports.handleValRequest = handleValRequest;
