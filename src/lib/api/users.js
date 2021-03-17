import firebase from "@/lib/firebase";
import Fuse from "fuse.js";

const db = firebase.firestore();

export const syncUser = async ({ uid, displayName, email, photoURL }) => {
	await db
		.collection("users")
		.doc(uid)
		.set(
			{
				...(displayName && { displayName }),
				...(email && { email }),
				...(photoURL && { photoURL }),
			},
			{ merge: true },
		);
};

export const getUserById = async ({ adminId }) => {
	return await db
		.collection("users")
		.doc(adminId)
		.get()
		.then(doc => ({ id: doc.id, ...doc.data() }));
};

export const listUsersByIds = async ({ memberIds }) => {
	const members = [];
	const snapshots = await db.collection("users").where("id", "in", memberIds).get();
	snapshots.forEach(doc => {
		members.push({ id: doc.id, ...doc.data() });
	});
	return members;
};

export const searchUsers = async ({ keyword }) => {
	const members = [];
	const snapshots = await db.collection("users").get();
	snapshots.forEach(doc => {
		members.push({ id: doc.id, ...doc.data() });
	});

	const options = { keys: ["email", "displayName"] };
	const myIndex = Fuse.createIndex(options.keys, members);
	const fuse = new Fuse(members, options, myIndex);

	return fuse.search(keyword).map(({ item }) => item);
};
