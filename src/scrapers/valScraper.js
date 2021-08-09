const {getData, convertCommandToValidValUser} = require('../helper/functions');
const puppeteer = require('puppeteer');
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

const getValLast20Stats = async (name) => {
	let url = ` https://api.tracker.gg/api/v2/valorant/standard/matches/riot/${convertCommandToValidValUser(encodeURI(name))}?type=competitive`;
	const res = await getData(url);
	return res;
};

const getValAgentStats = async (name) => {
	let url = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${convertCommandToValidValUser(encodeURI(name))}`;
	const res = await getData(url);
	return res;
};

const getLast20Accuracy = async (name) => {
	const browser = await puppeteer.launch({
		headless: true,
	});
	const page = await browser.newPage();
	let url = `https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(name))}/overview`;
	await page.goto(url, {waitUntil: 'networkidle2'});

	let results = await page.evaluate(() => {
		let hs = document.querySelector('table[class="accuracy__stats"] > tbody > tr >td').innerText;
		let body = document.querySelector('table[class="accuracy__stats"] > tbody > tr:nth-child(2) >td').innerText;
		let legs = document.querySelector('table[class="accuracy__stats"] > tbody > tr:nth-child(3) >td').innerText;

		return {
			'Headshot %': hs,
			'Bodyshot %': body,
			'Legshot %': legs,
		};
	});

	return results;
};

const getTopWeapons = async (name) => {
	const browser = await puppeteer.launch({
		headless: true,
		executablePath: '/usr/bin/chromium-browser',
	});
	const page = await browser.newPage();
	let url = `https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(name))}/overview`;
	await page.goto(url, {waitUntil: 'networkidle2'});

	let results = await page.evaluate(() => {
		let weapon1 = document.querySelector('div[class="top-weapons__weapons"] > div > div > div').innerText;
		let weapon2 = document.querySelector('div[class="top-weapons__weapons"] > div:nth-child(2) > div > div').innerText;
		let weapon3 = document.querySelector('div[class="top-weapons__weapons"] > div:nth-child(3) > div > div').innerText;

		return {
			'Gun #1': weapon1,
			'Gun #2': weapon2,
			'Gun #3': weapon3,
		};
	});

	return results;
};

const getTopWeaponsInfo = async (name) => {
	const browser = await puppeteer.launch({
		headless: true,
		executablePath: '/usr/bin/chromium-browser',
	});
	const page = await browser.newPage();
	let url = `https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(name))}/overview`;
	await page.goto(url, {waitUntil: 'networkidle2'});

	let results = await page.evaluate(() => {
		let weapon1 = document.querySelector('div[class="top-weapons__weapons"] > div > div > div').innerText;
		let weapon1Hs = document.querySelector('div[class="top-weapons__weapons"] > div > div:nth-child(2) > div > span').innerText;
		let weapon1Body = document.querySelector('div[class="top-weapons__weapons"] > div > div:nth-child(2) > div > span:nth-child(2)').innerText;
		let weapon1Legs = document.querySelector('div[class="top-weapons__weapons"] > div > div:nth-child(2) > div > span:nth-child(3)').innerText;
		let weapon1Kills = document.querySelector('div[class="top-weapons__weapons"] > div > div:nth-child(3) > span:nth-child(2)').innerText;

		let weapon2 = document.querySelector('div[class="top-weapons__weapons"] > div:nth-child(2) > div > div').innerText;
		let weapon2Hs = document.querySelector('div[class="top-weapons__weapons"] > div:nth-child(2) > div:nth-child(2) > div > span').innerText;
		let weapon2Body = document.querySelector(
			'div[class="top-weapons__weapons"] > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(2)'
		).innerText;
		let weapon2Legs = document.querySelector(
			'div[class="top-weapons__weapons"] > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(3)'
		).innerText;
		let weapon2Kills = document.querySelector(
			'div[class="top-weapons__weapons"] > div:nth-child(2) > div:nth-child(3) > span:nth-child(2)'
		).innerText;

		let weapon3 = document.querySelector('div[class="top-weapons__weapons"] > div:nth-child(3) > div > div').innerText;
		let weapon3Hs = document.querySelector('div[class="top-weapons__weapons"] > div:nth-child(3) > div:nth-child(2) > div > span').innerText;
		let weapon3Body = document.querySelector(
			'div[class="top-weapons__weapons"] > div:nth-child(3) > div:nth-child(2) > div > span:nth-child(2)'
		).innerText;
		let weapon3Legs = document.querySelector(
			'div[class="top-weapons__weapons"] > div:nth-child(3) > div:nth-child(2) > div > span:nth-child(3)'
		).innerText;
		let weapon3Kills = document.querySelector(
			'div[class="top-weapons__weapons"] > div:nth-child(3) > div:nth-child(3) > span:nth-child(2)'
		).innerText;

		return {
			[weapon1]: {
				Kills: weapon1Kills,
				'Headshot%': weapon1Hs,
				'Bodyshot%': weapon1Body,
				'Legshot%': weapon1Legs,
			},
			[weapon2]: {
				Kills: weapon2Kills,
				'Headshot%': weapon2Hs,
				'Bodyshot%': weapon2Body,
				'Legshot%': weapon2Legs,
			},
			[weapon3]: {
				Kills: weapon3Kills,
				'Headshot%': weapon3Hs,
				'Bodyshot%': weapon3Body,
				'Legshot%': weapon3Legs,
			},
		};
	});

	return results;
};

exports.getValStats = getValStats;
exports.getValLast20Stats = getValLast20Stats;
exports.getValAgentStats = getValAgentStats;
exports.getLast20Accuracy = getLast20Accuracy;
exports.getTopWeapons = getTopWeapons;
exports.getTopWeaponsInfo = getTopWeaponsInfo;
