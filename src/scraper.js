const puppeteer = require('puppeteer');

const getStats = async (args) => {
	//first reduce all args to one variable
	let user = convertCommandToValidUser(args);
	let url = `https://tracker.gg/valorant/profile/riot/${user}/overview`;

	let page = await configureBrowser(url);
	console.log(page);

	const text = await page.evaluate(() => document.body.innerHTML);
	console.log(text);
	return text;
};

const configureBrowser = async (url) => {
	const browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']});
	const page = await browser.newPage();
	await page.goto(url);
	return page;
};

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

exports.getStats = getStats;
