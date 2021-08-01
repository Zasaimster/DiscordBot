const admin = require('firebase-admin');
const db = admin.firestore();

const doesUserExist = async (id) => {
	const usersRef = db.collection('discord-users');
	const user = await usersRef.where('discord-id', '==', id).get();

	console.log(user.size);
	if (user.size === 0) return false;

	return true;
};

exports.doesUserExist = doesUserExist;
