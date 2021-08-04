const {doesUserExist, addUserInfo, getUserInfo, updateUserInfo} = require('../api');

const handleRegularRequest = async (CMD, message) => {
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

exports.handleRegularRequest = handleRegularRequest;
