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
exports.convertCommandToValidValUser = convertCommandToValidValUser;
