const {handleFnRequest} = require('./scrapers/fnScraper');
const {handleValRequest} = require('./scrapers/valScraper');

const {doesUserExist} = require('./api');

const PREFIX = '-';

module.exports = async function (message) {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	let msg = message.content.trim();
	const CMD = msg.indexOf(' ') === -1 ? msg.substr(PREFIX.length) : msg.substr(PREFIX.length, msg.indexOf(' ') - 1);
	if (CMD === 'register') {
		handleRegistration(message);
	}

	const [game, cmd] = interpretGame(CMD);
	const args = msg.substr(msg.indexOf(' ') + 1);

	const id = message.member.id;
	console.log(id);
	message.channel.send('your id is: ', id);

	if (game === 'fn') {
		const msg = await handleFnRequest(cmd, args, message.member.id);
		message.channel.send(msg);
	}

	console.log(game, cmd);
	if (game == 'val') {
		const msg = await handleValRequest(cmd, args, message.member.id);
		message.channel.send(msg);
	}
};

const interpretGame = (CMD) => {
	if (CMD.substr(0, 2) === 'fn') {
		return ['fn', CMD.substr(2)];
	}
	if (CMD.substr(0, 3) === 'val') {
		return ['val', CMD.substr(3)];
	}

	return 'invalid';
};

const handleRegistration = async (message) => {
	console.log('in handle registration');

	member = message.member;

	if (await doesUserExist(member.id)) {
		console.log('exists');
		message.channel.send('Your Discord account is already linked!');
	} else {
		console.log('does not exist');
		message.channel.send('Check DMs!');

		message.member.send('Time to register your stuff!').then((msg) => {
			msg.react('🇫').then(() => msg.react('🇻'));
		});
		member.createDM('hello');
	}
};
