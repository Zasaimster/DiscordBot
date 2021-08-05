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

		let embedInfo = getEmbedInfo(getLast20Info(matches));

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
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		if (res.status !== 200) {
			return res.status;
		}

		let embedInfo = getEmbedInfo(getTop3AgentInfo(stats)[0]);

		return embedSingleInfo(`${ign}'s Top Agent`, embedInfo, ign, author);
	}
	if (cmd === 'top2AgentInfo') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		if (res.status !== 200) {
			return res.status;
		}

		let embedInfo = getEmbedInfo(getTop3AgentInfo(stats)[1]);

		return embedSingleInfo(`${ign}'s Top Agent`, embedInfo, ign, author);
	}
	if (cmd === 'top3AgentInfo') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		if (res.status !== 200) {
			return res.status;
		}

		let embedInfo = getEmbedInfo(getTop3AgentInfo(stats)[2]);

		return embedSingleInfo(`${ign}'s Top Agent`, embedInfo, ign, author);
	}
	if (cmd === 'topAgent') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		if (res.status !== 200) {
			return res.status;
		}

		let info = getTop3AgentInfo(stats)[0];
		return embedSingleInfo(`${ign}'s Top Agent`, {name: `${info.Name}`, value: '\u200B'}, ign, author);
	}
	if (cmd === 'top3Agents') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		if (res.status !== 200) {
			return res.status;
		}

		let info = getTop3AgentInfo(stats);
		let embedInfo = [];
		embedInfo.push({name: '#1', value: `${info[0].Name}`});
		embedInfo.push({name: '#2', value: `${info[1].Name}`});
		embedInfo.push({name: '#3', value: `${info[2].Name}`});
		return embedSingleInfo(`${ign}'s Top 3 Agents`, embedInfo, ign, author);
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

const getTop3AgentInfo = (stats) => {
	let top3 = [0, 0, 0];

	for (const segment of stats) {
		if (segment.type === 'agent') {
			//check for top 1
			let temp = {};
			if (top3[0] === 0 || segment.stats.timePlayed.value >= top3[0].stats.timePlayed.value) {
				temp = top3[1];
				top3[1] = top3[0];
				top3[2] = temp;

				top3[0] = segment;
			} else if (top3[1] === 0 || segment.stats.timePlayed.value >= top3[1].stats.timePlayed.value) {
				top3[2] = top3[1];

				top3[1] = segment;
			} else if (top3[2] === 0 || segment.stats.timePlayed.value >= top3[2].stats.timePlayed.value) {
				top3[2] = segment;
			}
		}
	}
	let res = [];
	for (const agent of top3) {
		//name, time played, matches played, win%, kd, adr,
		res.push({
			Name: agent.metadata.name,
			'Time Played': agent.stats.timePlayed.displayValue,
			Matches: agent.stats.matchesPlayed.displayValue,
			'Win %': agent.stats.matchesWinPct.displayValue,
			'Kills/Round': agent.stats.killsPerRound.displayValue,
			KD: agent.stats.kDRatio.displayValue,
			ADR: agent.stats.damagePerRound.displayValue,
		});
	}

	return res;
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

const getEmbedInfo = (info) => {
	let embedInfo = [];
	for (const property in info) {
		embedInfo.push({name: `${property}`, value: info[property]});
	}

	return embedInfo;
};

exports.handleValRequest = handleValRequest;
