import firebase from "./firebase";

import toSlug from "@/utils/toSlug";

const db = firebase.firestore();
const storage = firebase.storage();

// LIST ALL BOARDS
export const listBoards = async () => {
	const boardsSnapshots = await db.collection("boards").get();

	const boards = [];
	boardsSnapshots.forEach(doc => {
		boards.push({ id: doc.id, ...doc.data() });
	});

	// Get cover src from filePath
	return await Promise.all(
		boards.map(async board => ({
			...board,
			cover: await storage.ref(board.coverPath).getDownloadURL(),
		})),
	);
};

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
		}),
	]);
};

// LIST ALL TASK LISTS OF A BOARD
export const listListsByBoard = async ({ boardSlug }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });

	const listSnapshots = await db.collection("boards").doc(boardId).collection("lists").get();

	const lists = [];
	listSnapshots.forEach(doc => {
		lists.push({ id: doc.id, ...doc.data() });
	});

	return await Promise.all(
		lists.map(async list => ({
			...list,
			tasks: await listTasksByList({
				boardSlug,
				listSlug: list.slug,
			}),
		})),
	);
};

// ADD A TASK LIST TO A BOARD
export const createList = async ({ boardSlug, id, title }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });

	const listSlug = toSlug(title);

	await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(id)
		.set({ title, slug: listSlug });
};

// LIST ALL TASKS OF A TASK LIST
export const listTasksByList = async ({ boardSlug, listSlug }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	const { id: listId } = await getListBySlug({ boardId, slug: listSlug });

	const taskSnapshots = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.get();

	const tasks = [];
	taskSnapshots.forEach(doc => {
		tasks.push({ id: doc.id, ...doc.data() });
	});

	return tasks;
};

// ADD A NEW TASK TO TASK LIST
export const createTask = async ({ boardSlug, listSlug, id, title }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	const { id: listId } = await getListBySlug({ boardId, slug: listSlug });

	const taskSlug = toSlug(title);

	await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc()
		.set({
			id,
			title,
			slug: taskSlug,
		});
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

// GET A TASK LIST BY SLUG
export const getListBySlug = async ({ boardId, slug }) => {
	const listSnapshots = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.where("slug", "==", slug)
		.limit(1)
		.get();

	const lists = [];
	listSnapshots.forEach(doc => {
		lists.push({ id: doc.id, ...doc.data() });
	});

	return lists[0];
};
