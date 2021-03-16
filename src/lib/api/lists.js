import toSlug from "@/utils/toSlug";
import firebase from "@/lib/firebase";
import { getBoardBySlug } from "./boards";
import { listTasksByList } from "./tasks";
import { listLabelsByBoard } from "./labels";

const db = firebase.firestore();

// ADD A TASK LIST TO A BOARD
export const createList = async ({ boardSlug, id, title }) => {
	const { id: boardId, order: listsOrder } = await getBoardBySlug({ slug: boardSlug });

	const listSlug = toSlug(title);

	await Promise.all([
		await db
			.collection("boards")
			.doc(boardId)
			.set({ order: [...listsOrder, id] }, { merge: true }),
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(id)
			.set({ title, slug: listSlug, order: [] }),
	]);
};

// LIST ALL TASK LISTS OF A BOARD
export const listListsByBoard = async ({ boardSlug }) => {
	const board = await getBoardBySlug({ slug: boardSlug });
	if (!board) return;
	const { id: boardId, order: listsOrder } = board;

	const listSnapshots = await db.collection("boards").doc(boardId).collection("lists").get();

	const lists = {};
	listSnapshots.forEach(doc => {
		const id = doc.id;
		lists[id] = { id, ...doc.data() };
	});

	const [listsInOrder, labels] = await Promise.all([
		await Promise.all(
			listsOrder.map(async listId => ({
				...lists[listId],
				tasks: await listTasksByList({
					boardSlug,
					listSlug: lists[listId].slug,
				}),
			})),
		),
		await listLabelsByBoard({ boardId }),
	]);

	return {
		...board,
		lists: listsInOrder,
		labels,
	};
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
