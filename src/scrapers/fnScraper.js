const axios = require('axios');
require('dotenv').config();

const {convertPRToReadableString, prettifyFNStats} = require('../helper/functions');

/*
fn: https://api.fortnitetracker.com/v1/powerrankings/pc/naw/zd zas
*/

const PLATFORM = 'pc';
const REGION = 'naw';

const handleFnRequest = async (cmd, args) => {
	if (cmd === 'Stats') {
		const stats = await getFnStats(args);
		if (stats.status !== undefined) {
			return stats.status;
		} else {
			return prettifyFNStats(stats);
		}
	}

	if (cmd === 'Pr') {
		const stats = await getPr(args);
		if (stats.status) {
			return stats.status;
		} else {
			return convertPRToReadableString(stats);
		}
	}

	if (cmd === 'Earnings') {
		const stats = await getEarnings(args);
		if (stats.status) {
			return stats.status;
		} else {
			return `$${stats}`;
		}
	}

	if (cmd === 'Events') {
		const stats = await getEvents(args);
		if (stats.status) {
			return stats.status;
		} else {
			return stats;
		}
	}

	if (cmd === 'Tracker') {
		return `https://fortnitetracker.com/profile/all/${encodeURI(args)}/events`;
	}
};

const getFnStats = async (epic) => {
	//first reduce all args to one variable
	//let epic = convertCommandToValidUser(args);
	console.log(epic);
	let url = `https://api.fortnitetracker.com/v1/powerrankings/${PLATFORM}/${REGION}/${encodeURI(epic)}`;

	const {data} = await axios
		.get(url, {
			headers: {
				'TRN-Api-key': process.env.TRN_API_KEY,
			},
		})
		.catch((err) => {
			console.log('requesting data error:', err);
		});

	//console.log(res);

	return data;
};

const getPr = async (epic) => {
	let platform = 'pc';
	let region = 'naw';
	let url = `https://api.fortnitetracker.com/v1/powerrankings/${PLATFORM}/${REGION}/${encodeURI(epic)}`;
	console.log(url);

	const {data} = await axios
		.get(url, {
			headers: {
				'TRN-Api-key': process.env.TRN_API_KEY,
			},
		})
		.catch((err) => {
			console.log('requesting data error:', err);
		});

	//console.log(res);

	return data.points;
};

const getEarnings = async (epic) => {
	let platform = 'pc';
	let region = 'naw';
	let url = `https://api.fortnitetracker.com/v1/powerrankings/${PLATFORM}/${REGION}/${encodeURI(epic)}`;
	console.log(url);

	const {data} = await axios
		.get(url, {
			headers: {
				'TRN-Api-key': process.env.TRN_API_KEY,
			},
		})
		.catch((err) => {
			console.log('requesting data error:', err);
		});

	//console.log(res);

	return data.cashPrize;
};

const getEvents = async (epic) => {
	let platform = 'pc';
	let region = 'naw';
	let url = `https://api.fortnitetracker.com/v1/powerrankings/${PLATFORM}/${REGION}/${encodeURI(epic)}`;
	console.log(url);

	const {data} = await axios
		.get(url, {
			headers: {
				'TRN-Api-key': process.env.TRN_API_KEY,
			},
		})
		.catch((err) => {
			console.log('requesting data error:', err);
		});

	//console.log(res);

	return data.events;
};

exports.handleFnRequest = handleFnRequest;
