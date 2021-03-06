const {getValStats, getValLast20Stats, getValAgentStats, getLast20Accuracy, getTopWeapons, getTopWeaponsInfo} = require('../scrapers/valScraper');
const {convertCommandToValidValUser} = require('../helper/functions');
const {MessageEmbed} = require('discord.js');
const {valHelpMsg} = require('../helper/constants');

const handleValRequest = async (cmd, ign, author) => {
	if (cmd === 'help') {
		return valHelpMsg;
	}
	let test = await getValStats(ign);
	if (test === undefined) {
		console.log(test);
		return `There was an error getting this account's information. It's either not a valid account or it's private and needs to be made public.\n\nTo find out more, go to https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(
			encodeURI(ign)
		)}/overview `;
	}

	if (cmd === 'stats') {
		//current rank, peak rank, kd, wins and losses, adr, kd, hs%, win%, kills, hs, deaths, assists, score/round, kill/rnd, clutches, highest kill game
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		let rank, peakRank;
		const tierName = stats.rank.metadata.tierName;
		if (tierName.startsWith('Immortal') || tierName.startsWith('Radiant')) {
			rank = tierName.substr(0, tierName.indexOf(' ')) + ' ' + stats.rank.displayValue + 'RR';
			peakRank = tierName.substr(0, tierName.indexOf(' ')) + ' ' + stats.peakRank.displayValue + 'RR' + ', ' + stats.peakRank.metadata.actName;
		} else {
			rank = stats.rank.displayValue;
			peakRank = `${stats.peakRank.displayValue}, ${stats.peakRank.metadata.actName}`;
		}

		const statsInfo = {
			Rank: rank,
			'Peak Rank': peakRank,
			'Win - Loss': `${stats.matchesWon.displayValue} - ${stats.matchesLost.displayValue}`,
			'Win %': `${stats.matchesWinPct.value}%`,
			KD: stats.kDRatio.displayValue,
			KAD: stats.kADRatio.displayValue,
			ADR: stats.damagePerRound.displayValue,
			'HS %': `${stats.headshotsPercentage.displayValue}%`,
			Headshots: stats.dealtHeadshots.displayValue,
			Kills: stats.kills.displayValue,
			Deaths: stats.deaths.displayValue,
			Assists: stats.assists.displayValue,
			'Score/Round': stats.scorePerRound.displayValue,
			'Kills/Round': stats.killsPerRound.displayValue,
			Clutches: stats.clutches.displayValue,
			Aces: stats.aces.displayValue,
			'Highest Kill Game': stats.mostKillsInMatch.displayValue,
		};

		let embedInfo = getEmbedInfo(statsInfo);

		embedInfo[0].inline = true;
		embedInfo[1].inline = true;

		embedInfo[4].inline = true;
		embedInfo[5].inline = true;
		embedInfo[6].inline = true;

		embedInfo[9].inline = true;
		embedInfo[10].inline = true;
		embedInfo[11].inline = true;

		embedInfo[12].inline = true;
		embedInfo[13].inline = true;

		//embedInfo[14].inline;

		console.log('overall stats:', embedInfo);

		return embedSingleInfo(`${ign}'s Comp Stats`, embedInfo, ign, author);
	}
	if (cmd === 'damageperround') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		console.log(`DPM: `, stats.damagePerRound.displayValue);

		return embedSingleInfo(`${ign}'s Damage Per Round`, {name: 'Damage Per Round', value: `${stats.damagePerRound.displayValue}`}, ign, author);
	}
	if (cmd === 'kd') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		console.log('KD: ', stats.kDRatio.displayValue);

		return embedSingleInfo(`${ign}'s KD Ratio`, {name: 'K/D Ratio', value: `${stats.kDRatio.displayValue}`}, ign, author);
	}
	if (cmd === 'kad') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		console.log('KAD: ', stats.kADRatio.displayValue);

		return embedSingleInfo(`${ign}'s KAD Ratio`, {name: 'KAD Ratio', value: `${stats.kADRatio.displayValue}`}, ign, author);
	}
	if (cmd === 'last20acc') {
		let info = getEmbedInfo(await getLast20Accuracy(ign));

		console.log('last 20 accuracy: ', info);

		return embedSingleInfo(`${ign}'s Recent Accuracy`, info, ign, author);
	}
	if (cmd === 'last20') {
		const res = await getValLast20Stats(ign);
		const matches = res.data.data.matches;

		let embedInfo = getEmbedInfo(getLast20Info(matches));

		console.log('last 20 info: ', embedInfo);

		return embedSingleInfo(`${ign}'s Last 20 Matches`, embedInfo, ign, author);
	}
	if (cmd === 'hs%') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		console.log('hs%: ', stats.headshotsPercentage.displayValue);

		return embedSingleInfo(
			`${ign}'s Headshot Percentage`,
			{name: 'Headshot %', value: `${stats.headshotsPercentage.displayValue}%`},
			ign,
			author
		);
	}
	if (cmd === 'win%') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		console.log('win%: ', stats.matchesWinPct.displayValue);
		return embedSingleInfo(`${ign}'s Win Percentage`, {name: 'Win %', value: `${stats.matchesWinPct.displayValue}`}, ign, author);
	}
	if (cmd === 'topagentinfo') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		let embedInfo = getEmbedInfo(getTop3AgentInfo(stats)[0]);

		console.log('Best agent: ', embedInfo);
		return embedSingleInfo(`${ign}'s Top Agent`, embedInfo, ign, author);
	}
	if (cmd === 'top2agentinfo') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		let embedInfo = getEmbedInfo(getTop3AgentInfo(stats)[1]);

		console.log('2nd best agent: ', embedInfo);

		return embedSingleInfo(`${ign}'s Top Agent`, embedInfo, ign, author);
	}
	if (cmd === 'top3agentinfo') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		let embedInfo = getEmbedInfo(getTop3AgentInfo(stats)[2]);

		console.log('3rd best agent: ', embedInfo);
		return embedSingleInfo(`${ign}'s Top Agent`, embedInfo, ign, author);
	}
	if (cmd === 'topagent') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		let info = getTop3AgentInfo(stats)[0];
		console.log('top agent: ', info.Name);
		return embedSingleInfo(`${ign}'s Top Agent`, {name: `${info.Name}`, value: '\u200B'}, ign, author);
	}
	if (cmd === 'top3agents') {
		const res = await getValAgentStats(ign);
		const stats = res.data.data.segments;

		let info = getTop3AgentInfo(stats);
		let embedInfo = [];
		embedInfo.push({name: '#1', value: `${info[0].Name}`});
		embedInfo.push({name: '#2', value: `${info[1].Name}`});
		embedInfo.push({name: '#3', value: `${info[2].Name}`});

		console.log('top 3 agent info: ', embedInfo);
		return embedSingleInfo(`${ign}'s Top 3 Agents`, embedInfo, ign, author);
	}
	if (cmd === 'tracker') {
		return `https://tracker.gg/valorant/profile/riot/${convertCommandToValidValUser(encodeURI(ign))}/overview`;
	}
	if (cmd === 'topweapons') {
		let info = getEmbedInfo(await getTopWeapons(ign));

		console.log('top weapons: ', info);
		return embedSingleInfo(`${ign}'s Top Weapons`, info, ign, author);
	}
	if (cmd === 'topweaponsinfo') {
		let info = getTopWeaponsEmbedInfo(await getTopWeaponsInfo(ign));

		console.log('top weapons info: ', info);
		return embedSingleInfo(`${ign}'s Top Weapons Info`, info, ign, author);
	}
	if (cmd === 'rank') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		let toDisplay;
		const tierName = stats.rank.metadata.tierName;
		if (tierName.startsWith('Immortal') || tierName.startsWith('Radiant')) {
			toDisplay = tierName.split(' ')[0] + ' ' + stats.rank.displayValue + 'RR';
		} else {
			toDisplay = stats.rank.displayValue;
		}
		console.log('rank: ', toDisplay);
		return embedSingleInfo(`${ign}'s Current Rank`, {name: 'Rank', value: `${toDisplay}`}, ign, author);
	}

	if (cmd === 'peakrank') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		let toDisplay;
		const tierName = stats.peakRank.metadata.tierName;
		if (tierName.startsWith('Immortal') || tierName.startsWith('Radiant')) {
			toDisplay = tierName.split(' ')[0] + ' ' + stats.peakRank.displayValue + 'RR' + ', ' + stats.peakRank.metadata.actName;
		} else {
			toDisplay = `${stats.peakRank.displayValue}, ${stats.peakRank.metadata.actName}`;
		}

		console.log('peak rank: ', toDisplay);
		return embedSingleInfo(`${ign}'s Peak Rank`, {name: 'Peak Rank', value: `${toDisplay}`}, ign, author);
	}

	if (cmd === 'playtime') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		console.log('time played: ', stats.timePlayed.displayValue);

		return embedSingleInfo(`${ign}'s Comp Playtime`, {name: 'Time Played', value: `${stats.timePlayed.displayValue}`}, ign, author);
	}

	if (cmd === 'matchesplayed') {
		const res = await getValStats(ign);
		const stats = res.data.data[0].stats;

		console.log('matches played: ', stats.matchesPlayed.displayValue);

		return embedSingleInfo(`${ign}'s Comp Matches Played`, {name: 'Matches Played', value: `${stats.matchesPlayed.displayValue}`}, ign, author);
	}
};

const getLast20Info = (matches) => {
	//give avg headshot%, win los (and %), kd, adr
	let hs = (wins = losses = kd = adr = 0);
	for (const matchInfo of matches) {
		let match = matchInfo.segments[0];
		hs += match.stats.headshotsPercentage.value;

		if (match.metadata.hasWon) {
			wins++;
		} else {
			losses++;
		}
		kd += match.stats.kdRatio.value;
		adr += match.stats.damagePerRound.value;
	}

	hs /= matches.length;
	//let winLoss = wins / losses;
	kd /= matches.length;
	adr /= matches.length;
	return {
		'Headshot %': `${hs.toFixed(1)}%`,
		'Win - Loss': `${wins} - ${losses}`,
		'Win %': `${((wins / (wins + losses)) * 100).toFixed(1)}`,
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

const getTopWeaponsEmbedInfo = (info) => {
	let embedInfo = [];

	for (const gun in info) {
		let value = '';
		for (const property in info[gun]) {
			value += `${property}: **${info[gun][property]}**\n`;
		}

		embedInfo.push({name: `${gun}`, value: `${value}`});
	}

	return embedInfo;
};

exports.handleValRequest = handleValRequest;
