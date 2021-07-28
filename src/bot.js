require('dotenv').config();
const {Client} = require('discord.js');

const {getStats} = require('./scraper');

const client = new Client();

const PREFIX = '-';

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
	console.log('ZasBot is ready to go!');
});

client.on('message', async (message) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;
	console.log('hello?');

	const [CMD, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
	console.log(args);

	if (CMD === 'stats') {
		//if there's a space in a person's username then reduce it down
		console.log('in stats');
		const stats = await getStats(args);
	}

	//message.channel.send('this is a command');
});
