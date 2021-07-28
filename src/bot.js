require('dotenv').config();
const {last} = require('cheerio/lib/api/traversing');
const {Client} = require('discord.js');

const {getAllStats, getPr, getEarnings, getEvents} = require('./scraper');

const client = new Client();

const PREFIX = '-';

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
	console.log('ZasBot is ready to go!');
});

client.on('message', async (message) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;
	console.log('hello?');

	//const [CMD, ...args] = message.content.trim().substring(PREFIX.length).split(' ', 2);
	let msg = message.content.trim();
	const CMD = msg.substr(PREFIX.length, msg.indexOf(' ') - 1);
	const [game, cmd] = interpretGame(CMD);
	const args = msg.substr(msg.indexOf(' ') + 1);

	if (game === 'fn') {
		if (cmd === 'Stats') {
			const stats = await getAllStats(args);
			if (stats.status) {
				message.channel.send(stats.status);
			} else {
				message.channel.send(prettifyFNStats(stats));
			}
		}

		if (cmd === 'Pr') {
			const stats = await getPr(args);
			if (stats.status) {
				message.channel.send(stats.status);
			} else {
				message.channel.send(convertPRToReadableString(stats));
			}
		}

		if (cmd === 'Earnings') {
			const stats = await getEarnings(args);
			if (stats.status) {
				message.channel.send(stats.status);
			} else {
				message.channel.send(`$${stats}`);
			}
		}

		if (cmd === 'Events') {
			const stats = await getEvents(args);
			if (stats.status) {
				message.channel.send(stats.status);
			} else {
				message.channel.send(stats);
			}
		}

		if (cmd === 'Tracker') {
			message.channel.send(`https://fortnitetracker.com/profile/all/${encodeURI(args)}/events`);
		}
	}
});

const convertPRToReadableString = (pr) => {
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

const getSpaces = (index) => {
	switch (index) {
		case 0:
			return 11;
		case 1:
			return 10;
		case 3:
			return 18;
		case 4:
			return 14;
		case 6:
			return 11;
		default:
			return 7;
	}
};

const interpretGame = (CMD) => {
	if (CMD.substr(0, 2) === 'fn') {
		return ['fn', CMD.substr(2)];
	}
	if (CMD.substr(0, 2) === 'val') {
		return ['val', CMD.substr(3)];
	}

	return 'invalid';
};
