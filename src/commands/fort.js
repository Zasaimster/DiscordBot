const {convertNumberToStringWithCommas, prettifyFNStats, convertCommandToValidValUser} = require('../helper/functions');
const {getFnStats} = require('../scrapers/fnScraper');
const {MessageEmbed} = require('discord.js');

const handleFnRequest = async (cmd, ign, author) => {
	if (cmd === 'help') {
		return `
			You can get Fortnite stats by registering your account with \`-register\` then using \`-fn <command>\` or by using \`-fn <command> <ign>\` (replace the brackets with a proper command/ign).\n\nValid Fortnite commands: \n\`-fn stats\`, \`-fn pr\`, \`-fn earnings\`, \`-fn events\`, \`-fn tracker\`
		`;
	}

	const stats = await getFnStats(ign);

	if (stats === undefined) {
		console.log('invalid fn ID');
		return 'Invalid Fortnite ID';
	}

	if (stats.status === 202) {
		console.log('error status 202');
		return `There was an error getting this account's info. This account may not exist, there may be no competitive history on this account, or there may be some other issue. Sorry about that\n\nYou can find more info about this account at https://fortnitetracker.com/profile/all/${encodeURI(
			ign
		)}/events`;
	}

	switch (cmd) {
		case 'stats':
			console.log(`Overall stats: ${stats.data}`);
			return embedStats(stats.data, ign, author);
		case 'pr':
			console.log(`PR: ${stats.data.points}`);
			return embedSingleInfo({name: 'PR', value: `${convertNumberToStringWithCommas(stats.data.points)}`}, stats.data, ign, author);
		case 'earnings':
			console.log(`Earnings: ${stats.data.cashPrize}`);
			return embedSingleInfo({name: 'Earnings', value: `$${stats.data.cashPrize}`}, stats.data, ign, author);
		case 'events':
			console.log(`Events Played: ${stats.data.events}`);
			return embedSingleInfo({name: 'Events', value: `${stats.data.events}`}, stats.data, ign, author);
		case 'tracker':
			return `https://fortnitetracker.com/profile/all/${encodeURI(ign)}/events`;
		default:
			return 'not a command';
	}
};

const embedStats = (data, ign, author) => {
	const statsEmbed = new MessageEmbed()
		.setColor('#006eff')
		.setTitle(`${data.name}'s Fortnite Stats`)
		.setURL(`https://fortnitetracker.com/profile/all/${encodeURI(ign)}/events`)
		.addFields(getFieldsStatsInfo(data))
		.setFooter(`${author}`, 'https://i.imgur.com/rywd92h.jpeg');

	return statsEmbed;
};

const embedSingleInfo = (stat, data, ign, author) => {
	const infoEmbed = new MessageEmbed()
		.setColor('#006eff')
		.setTitle(`${data.name}'s Fortnite Stats`)
		.setURL(`https://fortnitetracker.com/profile/all/${encodeURI(ign)}/events`)
		.addFields(stat)
		.setFooter(`${author}`, 'https://i.imgur.com/rywd92h.jpeg');

	return infoEmbed;
};

const getFieldsStatsInfo = (stats) => {
	let fields = [];

	fields.push({name: 'Region', value: stats.region, inline: true});
	fields.push({name: 'Platform', value: stats.platform, inline: true});
	fields.push({name: 'PR', value: convertNumberToStringWithCommas(stats.points)});
	fields.push({name: 'Rank', value: `#${convertNumberToStringWithCommas(stats.rank)}`});
	fields.push({name: 'Earnings', value: `$${stats.cashPrize}`});
	fields.push({name: 'Events', value: stats.events});

	return fields;
};

exports.handleFnRequest = handleFnRequest;
