require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORDJS_BOT_TOKEN);

//initialize firestore connection
const admin = require('firebase-admin');
const serviceAccount = require(`../${process.env.SERVICE_ACCOUNT_KEY}`);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

//setup db
const db = admin.firestore();

//initialize discord bot
client.on('ready', () => {
	console.log('ZasBot is online!');

	//silver to diamond: https://i.imgur.com/THA3rVI.jpg
	//monkey: https://i.imgur.com/othLBaA.png
	//client.user.setAvatar('https://i.imgur.com/THA3rVI.jpg');
	client.user.setActivity('Zas');
});

const commandHandler = require('./commandHandler');

client.on('message', commandHandler);
