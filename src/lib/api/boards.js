import firebase from "@/lib/firebase";
import toSlug from "@/utils/toSlug";
import sortByLastest from "@/utils/sortByLatest";

const db = firebase.firestore();
const storage = firebase.storage();

// CREATE A NEW BOARD
export const createBoard = async ({ id, title, isPrivate, cover }) => {
	const titleSlug = toSlug(title);
	const fileExt = cover.type.split("/")[1];
	const filePath = `/boards/${titleSlug}.${fileExt}`;

	await Promise.all([
		await storage.ref(filePath).put(cover),
		await db.collection("boards").doc(id).set({
			title,
			isPrivate,
			slug: titleSlug,
			coverPath: filePath,
			createdAt: firebase.firestore.Timestamp.now(),
			order: [],
		}),
	]);
};

// LIST ALL BOARDS
export const listBoards = async () => {
	const boardsSnapshots = await db.collection("boards").get();

	const boards = [];
	boardsSnapshots.forEach(doc => {
		boards.push({ id: doc.id, ...doc.data() });
	});

	// Order boards by created at date
	const orderedBoards = sortByLastest(boards);

	// Get cover src from filePath
	return await Promise.all(
		orderedBoards.map(async board => ({
			...board,
			cover: await storage.ref(board.coverPath).getDownloadURL(),
		})),
	);
};

// GET A BOARD BY SLUG
export const getBoardBySlug = async ({ slug }) => {
	const boardSnapshots = await db.collection("boards").where("slug", "==", slug).limit(1).get();

	const boards = [];
	boardSnapshots.forEach(doc => {
		boards.push({ id: doc.id, ...doc.data() });
	});

	return boards[0];
};
