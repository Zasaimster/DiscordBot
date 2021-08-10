const valCommands =
	'`-val stats`, `-val damagePerRound`, `-val kd`, `-val kad`, `-val last20acc`, `-val last20`, `-val hs%`, `-val win%`, `-val topAgentInfo`, `-val top2AgentInfo`, `-val top3AgentInfo`, `-val topAgent`, `-val top3Agents`, `-val tracker`, `-val topWeapons`, `-val topWeaponsInfo`, `-val rank`, `-val peakRank`, `-val playtime`, `-val matchesPlayed` ';

const valHelpMsg = `You can get Valorant stats by registering your account with \`-register\` then using \`-val <command>\` or by using \`-val <command> <ign>\` (replace the brackets with a proper command/ign).\n\nValid Valorant commands: \n${valCommands}`;

const valRegisterMsg =
	"You aren't registered. Use `-register` to register or give me an account by typing `-val <command> <ign>`\n\nValid Valorant commands:\n" +
	valCommands;

const fnCommands = `\`-fn stats\`, \`-fn pr\`, \`-fn earnings\`, \`-fn events\`, \`-fn tracker\``;

const fnHelpMsg = `
			You can get Fortnite stats by registering your account with \`-register\` then using \`-fn <command>\` or by using \`-fn <command> <ign>\` (replace the brackets with a proper command/ign).\n\nValid Fortnite commands: \n${fnCommands}
		`;

const fnRegisterMsg = `You aren't registered. Use \`-register\` to register or give me an account by typing \`-fn <command> <ign>\`\n\nValid Fortnite commands: \n${fnCommands}`;

exports.valCommands = valCommands;
exports.valHelpMsg = valHelpMsg;
exports.valRegisterMsg = valRegisterMsg;
exports.fnCommands = fnCommands;
exports.fnHelpMsg = fnHelpMsg;
exports.fnRegisterMsg = fnRegisterMsg;
