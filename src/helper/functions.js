const axios = require('axios');
require('dotenv').config();

const getData = async (url) => {
	//console.log(url);
	return await axios
		.get(url, {
			headers: {
				'TRN-Api-key': process.env.TRN_API_KEY,
			},
		})
		.catch((err) => {
			//console.log('requesting data error:', err);
		});
};

const convertNumberToStringWithCommas = (pr) => {
	return pr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const prettifyFNStats = ({region, name, platform, points, cashPrize, events, rank}) => {
	let lines = [];
	lines.push(`Name: ${name}`);
	lines.push(`Region: ${region}`);
	lines.push(`Platform: ${platform}`);
	lines.push(`PR: ${convertPRToReadableString(points)}`);
	lines.push(`Rank: ${rank}`);
	lines.push(`Earnings: ${cashPrize}`);
	lines.push(`Events: ${events}`);

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		let spaceIndex = line.indexOf(' ');

		//need to shift over text
		let start = line.substr(0, spaceIndex);
		let buffer = '';
		for (let j = 0; j < getSpaces(i); j++) {
			buffer += ' ';
		}
		let end = line.substr(spaceIndex + 1);
		lines[i] = start + buffer + end;
	}

	let res = '';
	for (let i = 0; i < lines.length; i++) {
		res += lines[i] + '\n';
	}

	return res;
};

const getSpaces = (num) => {
	let str = '';
	for (var i = 0; i < num; i++) {
		str += `\ `;
	}
	return str;
};

const convertCommandToValidValUser = (args) => {
	let user = '';
	//combine name into one argument if there are spaces
	for (var i = 0; i < args.length; i++) {
		if (args[i] === '') {
			user += '%20';
		} else {
			user += args[i];
		}
	}

	//now go through user and replace the # with %23
	for (i = 0; i < user.length; i++) {
		if (user[i] === '#') {
			//zas#8866
			user = user.substr(0, i) + '%23' + user.substr(i + 1);
		}
	}
	return user;
};

exports.getData = getData;
exports.convertNumberToStringWithCommas = convertNumberToStringWithCommas;
exports.convertCommandToValidValUser = convertCommandToValidValUser;
