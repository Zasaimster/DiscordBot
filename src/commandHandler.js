const {handleFnRequest} = require('./commands/fort');
const {handleValRequest} = require('./commands/val');

const {doesUserExist, addUserInfo, getUserInfo, updateUserInfo, getValId, getFnId} = require('./api');
const {val} = require('cheerio/lib/api/attributes');
const {handleRegularRequest} = require('./commands/regularCommands');

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

		realIgn = ign === '' ? await getFnId(message.author.id) : ign;

		const msg = await handleFnRequest(getPhrase, realIgn, message.author.username);
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

		realIgn = ign === '' ? await getValId(message.author.id) : ign;

		const msg = await handleValRequest(getPhrase, realIgn, message.author.username);
		message.channel.send(msg);
		//message.channel.send({embeds: [msg]});

		return;
	}

	const res = await handleRegularRequest(CMD, message);
	message.channel.send(res);

	//call separate file to handle all other commands
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
	//console.log(`CMD: '${CMD}', getPhrase: '${getPhrase}', ign: '${ign}', withoutCMD: '${withoutCMD}'`);

	return [CMD, getPhrase, ign];
};
