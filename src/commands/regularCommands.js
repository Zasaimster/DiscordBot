const {doesUserExist, addUserInfo, getUserInfo, updateUserInfo, getValId, getFnId} = require('../api');

const handleRegularRequest = async (CMD, message) => {
	if (CMD === 'register') {
		handleRegistration(message);
	}

	if (CMD === 'updateaccount') {
		handleUpdate(message);
	}

	if (CMD === 'valid') {
		let id = await getValId(message.author.id);
		id === '' ? message.channel.send('Your account is not setup') : message.channel.send(id);
	}

	if (CMD === 'fnid') {
		let id = await getFnId(message.author.id);
		id === '' ? message.channel.send('Your account is not setup') : message.channel.send(id);
	}

	if (CMD === 'help') {
		let res = `To get started you can get game stats right away by using \`-<game> help\` to find more information about retrieving stats for specific games.\nAvailable game help commands are:\n\`-fn help\`, \`-val help\`\n\nIf you'd like to register an account you can use \`-register\` to get started or use \`-updateAccount\` if you'd like to update your account information.\n\nIf you'd like to know your registered information you can find them by using \`-fnId\` or \`-valId\``;
		message.channel.send(res);
	}
};

const handleUpdate = async (message) => {
	member = message.member;

	if (await doesUserExist(member.id, message.member)) {
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
		message.channel.send(`You don't have your accounts linked yet. Use \`-register\` to get started`);
	}
};

const handleRegistration = async (message) => {
	console.log('in handle registration');
	member = message.member;

	if (await doesUserExist(member.id, message.member)) {
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
											`I'm saving your information, so now you can get your own stats (type \`-help\` for more info in the channel you typed \`-register\` in :)`
										);
										addUserInfo(info, member);
									})
									.catch((err) => message.channel.send(`Whoops, I didn't catch that. Please re-register again`));
							});
					});
				//.catch((collected) => message.channel.send(`Whoops, I didn't catch that. Please re-register again`));
			});
	}
};

exports.handleRegularRequest = handleRegularRequest;
