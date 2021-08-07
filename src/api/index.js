const admin = require('firebase-admin');
const db = admin.firestore();

const doesUserExist = async (id, member) => {
	const usersRef = db.collection('discord-users');
	const user = await usersRef.where('discord_id', '==', id).get();

	//console.log(user);
	if (user.size === 0) return false;

	let document;
	user.forEach((doc) => (document = doc));

	if (document.data().discord_username !== member.user.username + '#' + member.user.discriminator) {
		await updateUserDiscordUsername(id, member);
	}

	return true;
};

const updateUserDiscordUsername = async (id, member) => {
	const res = await db
		.collection('discord-users')
		.doc(id)
		.update({
			discord_username: member.user.username + '#' + member.user.discriminator,
		});
	console.log(`Updated doc with id: ${res.discord_id}`);
};

const addUserInfo = async (info, member) => {
	let username = member.user.username + '#' + member.user.discriminator;
	let obj = {
		discord_id: member.id,
		discord_username: username,
		val_id: info.valId,
		fn_id: info.fnId,
	};

	const res = await db.collection('discord-users').doc(member.id).set(obj);
	console.log(`Added doc with id: ${member.id}`);
};

const getUserInfo = async (id) => {
	const user = await db.collection('discord-users').doc(id).get();

	return {
		valId: user.data().val_id,
		fnId: user.data().fn_id,
	};
};

const getValId = async (id) => {
	const user = await db.collection('discord-users').doc(id).get();

	return user.data() === undefined ? '' : user.data().val_id;
};

const getFnId = async (id) => {
	const user = await db.collection('discord-users').doc(id).get();

	return user.data() === undefined ? '' : user.data().fn_id;
};

const updateUserInfo = async (info, id) => {
	const res = await db.collection('discord-users').doc(id).update({
		val_id: info.valId,
		fn_id: info.fnId,
	});
	console.log(`Updated doc with id: ${res.discord_id}`);
};

exports.doesUserExist = doesUserExist;
exports.addUserInfo = addUserInfo;
exports.getUserInfo = getUserInfo;
exports.updateUserInfo = updateUserInfo;
exports.getValId = getValId;
exports.getFnId = getFnId;
