const {convertPRToReadableString, prettifyFNStats, convertCommandToValidValUser} = require('../helper/functions');
const {getFnStats} = require('../scrapers/fnScraper');
const {MessageEmbed} = require('discord.js');

const handleFnRequest = async (cmd, ign, author) => {
	const stats = await getFnStats(ign);
	if (stats.status !== undefined && stats.status !== 200) {
		return stats.status;
	}
	switch (cmd) {
		case 'stats':
			return embedStats(stats.data, ign, author);
		case 'pr':
			return embedSingleInfo({name: 'PR', value: `${convertPRToReadableString(stats.data.points)}`}, stats.data, ign, author);
		case 'earnings':
			return embedSingleInfo({name: 'Earnings', value: `$${stats.data.cashPrize}`}, stats.data, ign, author);
		case 'events':
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
	fields.push({name: 'PR', value: convertPRToReadableString(stats.points)});
	fields.push({name: 'Rank', value: stats.rank});
	fields.push({name: 'Earnings', value: stats.cashPrize});
	fields.push({name: 'Events', value: stats.events});

	return fields;
};

exports.handleFnRequest = handleFnRequest;
