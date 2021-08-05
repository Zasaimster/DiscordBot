const {getValStats, getValLast20Stats, getValAgentStats} = require('../scrapers/valScraper');
const {convertCommandToValidValUser} = require('../helper/functions');
const {MessageEmbed} = require('discord.js');

const handleValRequest = async (cmd, ign, author) => {
	console.log(cmd);
	if (cmd === 'help') {
		console.log('help');
		let commands =
			'-val stats, -val damagePerRound, -val kd, -val kad, -val last20acc, -val last20, -val hs%, -val win%, -val topAgentInfo, -val top3AgentsInfo, -val topAgent, -val top3Agents, -val tracker, -val topWeapons, -val topWeaponsInfo';

		return commands;
	}

	if (cmd === 'stats') {
		//figure this one out
		//return res[0].stats;
		return 'work in progress';
	}
	if (cmd === 'damagePerRound') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		if (res.status !== 200) {
			return res.status;
		}

		return embedSingleInfo({name: 'Damage Per Round', value: `${stats.damagePerRound.displayValue}`}, ign, author);
	}
	if (cmd === 'kd') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		if (res.status !== 200) {
			return res.status;
		}

		return embedSingleInfo({name: 'K/D Ratio', value: `${stats.kDRatio.displayValue}`}, ign, author);
	}
	if (cmd === 'kad') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		if (res.status !== 200) {
			return res.status;
		}

		return embedSingleInfo({name: 'KAD Ratio', value: `${stats.kADRatio.displayValue}`}, ign, author);
	}
	if (cmd === 'last20acc') {
		const res = await getValLast20Stats(ign);
		const matches = res.data.data.matches;

		if (res.status !== 200) {
			return res.status;
		}

		//let info = getLast20Accuracy(matches);

		return embedSingleInfo(embedInfo, ign, author);
	}
	if (cmd === 'last20') {
		const res = await getValLast20Stats(ign);
		const matches = res.data.data.matches;

		if (res.status !== 200) {
			return res.status;
		}

		let info = getLast20Info(matches);
		let embedInfo = [];
		for (const property in info) {
			embedInfo.push({name: `${property}`, value: info[property]});
		}

		return embedSingleInfo(`${ign}'s Last 20 Matches`, embedInfo, ign, author);
	}
	if (cmd === 'hs%') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		if (res.status !== 200) {
			return res.status;
		}

		return embedSingleInfo({name: 'Headshot %', value: `${stats.headshotsPercentage.displayValue}%`}, ign, author);
	}
	if (cmd === 'win%') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		if (res.status !== 200) {
			return res.status;
		}

		return embedSingleInfo({name: 'Win %', value: `${stats.matchesWinPct.displayValue}`}, ign, author);
	}
	if (cmd === 'topAgentInfo') {
		return embedSingleInfo({name: 'Top Agent Info', value: `${'work in progress'}`}, ign, author);
	}
	if (cmd === 'top3AgentsInfo') {
		return embedSingleInfo({name: 'Top 3 Agents Info', value: `${'work in progress'}`}, ign, author);
	}
	if (cmd === 'topAgent') {
		return embedSingleInfo({name: 'Top Agent', value: `${'work in progress'}`}, ign, author);
	}
	if (cmd === 'top3Agents') {
		return embedSingleInfo({name: 'Top 3 Agents', value: `${'work in progress'}`}, ign, author);
	}
	if (cmd === 'tracker') {
		return `https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(ign))}/overview`;
	}
	if (cmd === 'topWeapons') {
		//use puppeteer and cheerio to get that info since there's no fetch request that I can access for that info
		return embedSingleInfo({name: 'Top Weapons', value: `${'work in progress'}`}, ign, author);
	}
	if (cmd === 'topWeaponsInfo') {
		return embedSingleInfo({name: 'Top Weapons Info', value: `${'work in progress'}`}, ign, author);
	}
	//implement command to get someones rank
	//implement command to get someone's peak rank
	//implement command to get someone's playtime
	//implement command to get someone's matches played
};

const getLast20Accuracy = (matches) => {
	//puppeteer + cheerio this
};

const getLast20Info = (matches) => {
	//give avg headshot%, win los (and %), kd, adr
	let hs = (wins = losses = kd = adr = 0);
	for (const matchInfo of matches) {
		let match = matchInfo.segments[0];
		hs += match.stats.headshotsPercentage.value;
		console.log(hs);
		if (match.metadata.hasWon) {
			wins++;
		} else {
			losses++;
		}
		kd += match.stats.kdRatio.value;
		adr += match.stats.damagePerRound.value;
	}
	console.log(hs);
	hs /= matches.length;
	//let winLoss = wins / losses;
	kd /= matches.length;
	adr /= matches.length;
	return {
		'Headshot %': `${hs.toFixed(1)}%`,
		'Win - Loss': `${wins} - ${losses}`,
		'Win %': `${(wins / losses).toFixed(1)}`,
		'KD Ratio': kd.toFixed(2),
		ADR: adr.toFixed(0),
	};
};

const embedStats = (ign, author) => {
	const statsEmbed = new MessageEmbed()
		.setColor('#ff4040')
		.setTitle(`${ign}'s Fortnite Stats`)
		.setURL(`https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(ign))}/overview`)
		//.addFields(getFieldsStatsInfo(data))
		.setFooter(`${author}`, 'https://i.imgur.com/rywd92h.jpeg');

	return statsEmbed;
};

const embedSingleInfo = (title, stat, ign, author) => {
	const infoEmbed = new MessageEmbed()
		.setColor('#ff4040')
		.setTitle(title)
		.setURL(`https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(ign))}/overview`)
		.addFields(stat)
		.setFooter(`${author}`, 'https://i.imgur.com/O3oribA.png');

	return infoEmbed;
};

exports.handleValRequest = handleValRequest;
