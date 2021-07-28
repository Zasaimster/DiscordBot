require('dotenv').config();
const {last} = require('cheerio/lib/api/traversing');
const {Client} = require('discord.js');

const {getAllStats} = require('./scraper');

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
	const args = msg.substr(msg.indexOf(' ') + 1);
	console.log(CMD);

	if (CMD === 'stats') {
		//if there's a space in a person's username then reduce it down
		console.log('in stats');
		const stats = await getAllStats(args);
		const {region, name, platform, points, cashPrize, events, rank} = stats;
		console.log(stats);
		let res = `Name: ${name}
Region: ${region}
Platform: ${platform}
PR: ${convertPRToReadableString(points)}
Rank: #${rank}
Earnings: $${cashPrize}
Events: ${events}`;
		//console.log();
		message.channel.send(prettifyFNStats(stats));
	}

	//message.channel.send('this is a command');
});

const convertPRToReadableString = (pr) => {
	return pr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const prettifyFNStats = ({region, name, platform, points, cashPrize, events, rank}) => {
	let lines = [];
	lines.push(`Name: ${name}`);
	lines.push(`Region: ${region}`);
	lines.push(`Platform: ${platform}`);
	lines.push(`PR: ${points}`);
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
