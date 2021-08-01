const {getData, convertCommandToValidValUser} = require('../helper/functions');
/*
last 20 matches: https://api.tracker.gg/api/v2/valorant/standard/matches/riot/zas%238866?type=competitive
overall playlist stats: https://api.tracker.gg/api/v2/valorant/standard/profile/riot/zas%238866/segments/playlist?key=competitive
agent info: https://api.tracker.gg/api/v2/valorant/standard/profile/riot/zas%238866? (it'll be in there)
*/

const getValStats = async (name) => {
	console.log('in get val stats');
	let url = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${convertCommandToValidValUser(
		encodeURI(name)
	)}/segments/playlist?key=competitive`;
	const res = await getData(url);
	return res;
};

exports.getValStats = getValStats;
