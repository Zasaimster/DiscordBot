const axios = require('axios');
require('dotenv').config();

/*
PR: https://api.fortnitetracker.com/v1/powerrankings/pc/naw/zd zas

*/

const getAllStats = async (epic) => {
	//first reduce all args to one variable
	//let epic = convertCommandToValidUser(args);
	console.log(epic);
	let platform = 'pc';
	let region = 'naw';
	let url = `https://api.fortnitetracker.com/v1/powerrankings/${platform}/${region}/${encodeURI(epic)}`;
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

	return data;
};

const configureBrowser = async (url) => {};

const convertCommandToValidUser = (args) => {
	let user = '';
	//combine name into one argument if there are spaces
	for (var i = 0; i < args.length; i++) {
		if (args[i] === '') {
			user += '%20';
		} else {
			user += args[i];
		}
	}
	console.log(user);
	//now go through user and replace the # with %23
	for (i = 0; i < user.length; i++) {
		if (user[i] === '#') {
			//zas#8866
			user = user.substr(0, i) + '%23' + user.substr(i + 1);
		}
	}

	return user;
};

exports.getAllStats = getAllStats;
