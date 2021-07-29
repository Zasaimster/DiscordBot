require('dotenv').config();
const {last} = require('cheerio/lib/api/traversing');
const {Client} = require('discord.js');
const {handleFnRequest} = require('./scrapers/fnScraper');
const {handleValRequest} = require('./scrapers/valScraper');

const client = new Client();

const PREFIX = '-';

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
	console.log('ZasBot is online!');

	//silver to diamond: https://i.imgur.com/THA3rVI.jpg
	//monkey: https://i.imgur.com/othLBaA.png
	//client.user.setAvatar('https://i.imgur.com/THA3rVI.jpg');
	client.user.setActivity('Zas');
});

client.on('message', async (message) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	let msg = message.content.trim();
	const CMD = msg.indexOf(' ') === -1 ? msg.substr(PREFIX.length) : msg.substr(PREFIX.length, msg.indexOf(' ') - 1);
	const [game, cmd] = interpretGame(CMD);
	const args = msg.substr(msg.indexOf(' ') + 1);

	if (game === 'fn') {
		const msg = await handleFnRequest(cmd, args);
		message.channel.send(msg);
	}

	console.log(game, cmd);
	if (game == 'val') {
		const msg = await handleValRequest(cmd, args);
		message.channel.send(msg);
	}
});

const interpretGame = (CMD) => {
	if (CMD.substr(0, 2) === 'fn') {
		return ['fn', CMD.substr(2)];
	}
	if (CMD.substr(0, 3) === 'val') {
		return ['val', CMD.substr(3)];
	}

	return 'invalid';
};
