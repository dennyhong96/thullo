import firebase from "@/lib/firebase";

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
