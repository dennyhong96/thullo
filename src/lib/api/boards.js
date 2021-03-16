import firebase from "@/lib/firebase";
import toSlug from "@/utils/toSlug";
import sortByLastest from "@/utils/sortByLatest";
import generateId from "@/utils/generateId";
import { getUserById, listUsersByIds } from "./users";

const db = firebase.firestore();
const storage = firebase.storage();

// CREATE A NEW BOARD
export const createBoard = async ({ id, title, isPrivate, cover, uid }) => {
	const titleSlug = toSlug(title);
	const fileExt = cover.type.split("/")[1];
	const filePath = `/boards/${titleSlug}.${fileExt}`;

	const defaultLists = [
		{
			id: generateId(),
			title: "Backlog",
			slug: toSlug("Backlog"),
			order: [],
		},
		{
			id: generateId(),
			title: "In Progress",
			slug: toSlug("In Progress"),
			order: [],
		},
		{
			id: generateId(),
			title: "In Review",
			slug: toSlug("In Review"),
			order: [],
		},
		{
			id: generateId(),
			title: "Completed",
			slug: toSlug("Completed"),
			order: [],
		},
	];

	await Promise.all([
		await storage.ref(filePath).put(cover),
		await db
			.collection("boards")
			.doc(id)
			.set({
				title,
				isPrivate,
				slug: titleSlug,
				coverPath: filePath,
				createdAt: firebase.firestore.Timestamp.now(),
				order: defaultLists.map(list => list.id),
				admin: uid,
				members: [],
			}),
		await Promise.all(
			defaultLists.map(list =>
				db
					.collection("boards")
					.doc(id)
					.collection("lists")
					.doc(list.id)
					.set({ title: list.title, slug: list.slug, order: list.order }),
			),
		),
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
			admin: await getUserById({ adminId: board.admin }),
			members: board.members.length ? await listUsersByIds({ memberIds: board.members }) : [],
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
