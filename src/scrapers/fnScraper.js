const {getData} = require('../helper/functions');

const PLATFORM = 'pc';
const REGION = 'naw';

/*
fn: https://api.fortnitetracker.com/v1/powerrankings/pc/naw/zd zas
*/

const getFnStats = async (epic) => {
	let url = `https://api.fortnitetracker.com/v1/powerrankings/${PLATFORM}/${REGION}/${encodeURI(epic)}`;
	const res = await getData(url);
	return res;
};

exports.getFnStats = getFnStats;
