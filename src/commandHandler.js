const {handleFnRequest} = require('./commands/fort');
const {handleValRequest} = require('./commands/val');

const {getValId, getFnId} = require('./api');
const {handleRegularRequest} = require('./commands/regularCommands');
const {fnRegisterMsg, valRegisterMsg} = require('./helper/constants');

const PREFIX = '-';

module.exports = async function (message) {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	let msg = message.content.trim();

	messageDestructor(msg);

	const [CMD, getPhrase, ign] = messageDestructor(msg);
	console.log(`${message.author.username} called -${CMD} ${getPhrase} ${ign}`);
	//let userExist = await doesUserExist(message.author.id, message.member);

	if (CMD === 'fn') {
		if (getPhrase === '') {
			message.channel.send('Use `-fn help` to get a list of available commands');
			return;
		}
		realIgn = ign === '' ? await getFnId(message.author.id) : ign;

		if (realIgn === '') {
			message.channel.send(fnRegisterMsg);
			return;
		}

		const msg = await handleFnRequest(getPhrase.toLowerCase(), realIgn, message.author.username);
		message.channel.send(msg);

		return;
	}

	if (CMD == 'val') {
		if (getPhrase === '') {
			message.channel.send('Use `-val help` to get a list of available commands');
			return;
		}
		realIgn = ign === '' ? await getFnId(message.author.id) : ign;
		if (realIgn === '') {
			message.channel.send(valRegisterMsg);
			return;
		}
		realIgn = ign === '' ? await getValId(message.author.id) : ign;

		const msg = await handleValRequest(getPhrase.toLowerCase(), realIgn, message.author.username);
		message.channel.send(msg);
		//message.channel.send({embeds: [msg]});

		return;
	}

	await handleRegularRequest(CMD, message);
	//message.channel.send(res);

	//call separate file to handle all other commands
};

const messageDestructor = (msg) => {
	const space1 = msg.indexOf(' ');
	//if its just -xxx, then make that the cmd. if there is more, take substr until first space
	//game or generic command

	const CMD = msg.indexOf(' ') === -1 ? msg.substr(PREFIX.length).toLowerCase() : msg.substr(PREFIX.length, msg.indexOf(' ') - 1).toLowerCase();

	const withoutCMD = space1 === -1 ? '' : msg.substr(space1 + 1);
	const space2 = withoutCMD.indexOf(' ');
	//get game
	//ex: -val stats zas #8866
	const getPhrase = space2 === -1 ? withoutCMD : withoutCMD.substr(0, space2);

	const ign = space2 === -1 ? '' : withoutCMD.substring(space2 + 1);
	//console.log(`CMD: '${CMD}', getPhrase: '${getPhrase}', ign: '${ign}', withoutCMD: '${withoutCMD}'`);

	return [CMD, getPhrase, ign];
};
