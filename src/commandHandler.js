const {handleFnRequest} = require('./commands/fort');
const {handleValRequest} = require('./commands/val');

const {doesUserExist, addUserInfo, getUserInfo, updateUserInfo} = require('./api');
const {MessageAttachment} = require('discord.js');
const {val} = require('cheerio/lib/api/attributes');
const {registerCustomQueryHandler} = require('puppeteer');

const PREFIX = '-';

module.exports = async function (message) {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	let msg = message.content.trim();

	messageDestructor(msg);

	const [CMD, getPhrase, ign] = messageDestructor(msg);

	let userExist = doesUserExist(message.author.id);

	if (CMD === 'fn') {
		if (ign === '' && !userExist) {
			message.channel.send('Give me an account to find or register using -register');
			return;
		}
		if (getPhrase === '') {
			message.channel.send('Use -fn help to get a list of available commands');
			return;
		}

		const msg = await handleFnRequest(getPhrase, ign, message.member.id);
		message.channel.send(msg);

		return;
	}

	if (CMD == 'val') {
		if (ign === '' && !userExist) {
			message.channel.send('Give me an account to find or register using -register');
			return;
		}

		if (getPhrase === '') {
			message.channel.send('Use -val help to get a list of available commands');
			return;
		}

		const msg = await handleValRequest(getPhrase, ign, message.member.id);
		message.channel.send(msg);

		return;
	}

	//call separate file to handle all other commands

	if (CMD === 'register') {
		handleRegistration(message);
	}

	if (CMD === 'updateAccount') {
		handleUpdate(message);
	}

	if (CMD === 'valId') {
		if (await doesUserExist(message.author.id)) {
			let info = await getUserInfo(message.author.id);
			message.channel.send(info.valId);
		} else {
			message.channel.send('Your account is not setup');
		}
	}

	if (CMD === 'fnId') {
		if (await doesUserExist(message.author.id)) {
			let info = await getUserInfo(message.author.id);
			message.channel.send(info.fnId);
		} else {
			message.channel.send('Your account is not setup');
		}
	}
};

const handleRegistration = async (message) => {
	console.log('in handle registration');
	member = message.member;

	if (await doesUserExist(member.id)) {
		console.log('exists');
		message.channel.send('Your Discord account is already linked!');
	} else {
		message.channel.send('Check DMs!');

		let filter = (m) => m.author.id === message.author.id;

		message.member
			.send(`If you'd like to connect your Valorant account, type your IGN. If you don't want to, respond with na`)
			.then((message) => {
				message.channel
					.awaitMessages(filter, {
						max: 1,
						time: 30000,
						error: ['time'],
					})
					.then((collected) => {
						console.log(collected.first().content.trim());
						let info = {};
						info.valId = collected.first().content.trim();
						message.channel
							.send(`Got it, if you'd also like to connect your Fortnite account, type your IGN. If you don't want to, respond with na`)
							.then((message) => {
								message.channel
									.awaitMessages(filter, {
										max: 1,
										time: 30000,
										error: ['time'],
									})
									.then((collected) => {
										info.fnId = collected.first().content.trim();
										message.channel.send(
											`I'm saving your information, so now you can get your own stats by just doing -valStats (or any other command) without putting your name after it :)`
										);
										addUserInfo(info, member.id);
									})
									.catch((err) => message.channel.send(`Whoops, I didn't catch that. Please re-register again`));
							});
					});
				//.catch((collected) => message.channel.send(`Whoops, I didn't catch that. Please re-register again`));
			});
	}
};

const handleUpdate = async (message) => {
	member = message.member;

	if (await doesUserExist(member.id)) {
		const currentInfo = await getUserInfo(member.id);
		console.log(currentInfo);

		message.channel.send('Check DMs!');

		let filter = (m) => m.author.id === message.author.id;

		message.member
			.send(
				`Your current Valorant account is: ${currentInfo.valId}. Send your new username if you'd like to update your account. Otherwise, type na`
			)
			.then((message) => {
				message.channel
					.awaitMessages(filter, {
						max: 1,
						time: 100000,
						error: ['time'],
					})
					.then((collected) => {
						let info = {};
						info.valId = collected.first().content.trim() === 'na' ? currentInfo.valId : collected.first().content.trim();
						message.channel
							.send(
								`Got it, your Fortnite account is: ${currentInfo.fnId}. Send your new username if you'd like to update your account. Otherwise, type na`
							)
							.then((message) => {
								message.channel
									.awaitMessages(filter, {
										max: 1,
										time: 100000,
										error: ['time'],
									})
									.then((collected) => {
										info.fnId = collected.first().content.trim() === 'na' ? currentInfo.fnId : collected.first().content.trim();
										message.channel.send(`Saving your info. Valorant: ${info.valId} Fortnite: ${info.fnId}`);
										updateUserInfo(info, member.id);
									})
									.catch((err) => message.channel.send(`Whoops, I didn't catch that. Please re-register again`));
							});
					});
				//.catch((collected) => message.channel.send(`Whoops, I didn't catch that. Please re-register again`));
			});
	} else {
		message.channel.send(`You don't have your accounts linked yet. Use -register to get started`);
	}
};

const messageDestructor = (msg) => {
	const space1 = msg.indexOf(' ');
	//if its just -xxx, then make that the cmd. if there is more, take substr until first space
	//game or generic command
	-val;
	const CMD = msg.indexOf(' ') === -1 ? msg.substr(PREFIX.length) : msg.substr(PREFIX.length, msg.indexOf(' ') - 1);

	const withoutCMD = space1 === -1 ? '' : msg.substr(space1 + 1);
	const space2 = withoutCMD.indexOf(' ');
	//get game
	//ex: -val stats zas #8866
	const getPhrase = space2 === -1 ? withoutCMD : withoutCMD.substr(0, space2);

	const ign = space2 === -1 ? '' : withoutCMD.substring(space2 + 1);

	console.log(`CMD: '${CMD}', getPhrase: '${getPhrase}', ign: '${ign}', withoutCMD: '${withoutCMD}'`);

	return [CMD, getPhrase, ign];
};
