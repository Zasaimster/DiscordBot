const {getData, convertCommandToValidValUser} = require('../helper/functions');
/*
last 20 matches: https://api.tracker.gg/api/v2/valorant/standard/matches/riot/zas%238866?type=competitive
overall playlist stats: https://api.tracker.gg/api/v2/valorant/standard/profile/riot/zas%238866/segments/playlist?key=competitive
*/

const getValStats = async (name) => {
	console.log('in get val stats');
	let url = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${convertCommandToValidValUser(
		encodeURI(name)
	)}/segments/playlist?key=competitive`;
	const res = await getData(url);
	return res;
};

const handleValRequest = async (cmd, args) => {
	const res = await getValStats(args);
	const stats = res.data.data[0].stats;
	if (res.status !== 200) {
		return res.status;
	}

	if (cmd === 'Stats') {
		//figure this one out
		return res[0].stats;
	}
	if (cmd === 'DamagePerRound') {
		return stats.damagePerRound.value;
	}
	if (cmd === 'KD') {
	}
	if (cmd === 'KAD') {
	}
	if (cmd === 'Last20Acc') {
	}
	if (cmd === 'Last20') {
	}
	if (cmd === 'HS%') {
	}
	if (cmd === 'Win%') {
	}
	if (cmd === 'TopAgentInfo') {
	}
	if (cmd === 'Top3AgentsInfo') {
	}
	if (cmd === 'TopAgent') {
	}
	if (cmd === 'Top3Agents')
		if (cmd === 'Tracker') {
		}
	if (cmd === 'TopWeapons') {
	}
	if (cmd === 'TopWeaponsInfo') {
	}
};

exports.handleValRequest = handleValRequest;
