require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORDJS_BOT_TOKEN);

//initialize firestore connection
const admin = require('firebase-admin');

admin.initializeApp({
	credential: admin.credential.cert({
		type: 'service_account',
		project_id: 'zasbot-6865a',
		private_key_id: process.env.PRIVATE_KEY_ID,
		private_key: process.env.PRIVATE_KEY,
		client_email: process.env.CLIENT_EMAIL,
		client_id: process.env.CLIENT_ID,
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url: process.env.X509_CERT_URL,
	}),
});

//setup db
const db = admin.firestore();

//initialize discord bot
client.on('ready', () => {
	console.log('ZasBot is online!');

	//silver to diamond: https://i.imgur.com/THA3rVI.jpg
	//monkey: https://i.imgur.com/othLBaA.png
	//client.user.setAvatar('https://i.imgur.com/THA3rVI.jpg');
	client.user.setActivity('-help');
});

const commandHandler = require('./commandHandler');

client.on('message', commandHandler);
