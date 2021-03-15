import firebase from "@/lib/firebase";
import { getBoardBySlug } from "./boards";

const db = firebase.firestore();

// RE-ORDER TASK
export const reorderTaskList = async ({
	boardSlug,
	taskId,
	newListId,
	newIndex,
	oldListId,
	oldIndex,
}) => {
	// Get board id
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });

	// Get old list
	const oldList = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(oldListId)
		.get()
		.then(doc => ({ id: doc.id, ...doc.data() }));

	const oldListReordered = [...oldList.order];
	const [removedId] = oldListReordered.splice(oldIndex, 1);

	// Task moved within same list
	if (newListId === oldListId) oldListReordered.splice(newIndex, 0, removedId);

	// Re-order old list
	await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(oldListId)
		.set({ order: oldListReordered }, { merge: true });

	// Task moved within same list, done here
	if (newListId === oldListId) return;

	// Get the task
	const { id, ...taskData } = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(oldListId)
		.collection("tasks")
		.doc(taskId)
		.get()
		.then(doc => ({ id: doc.id, ...doc.data() }));

	console.log(" Get the task", { id, ...taskData });

	const [newList] = await Promise.all([
		// Get newList
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(newListId)
			.get()
			.then(doc => ({ id: doc.id, ...doc.data() })),
		// Delete task from old list
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(oldListId)
			.collection("tasks")
			.doc(taskId)
			.delete(),
		// Insert task into new list
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(newListId)
			.collection("tasks")
			.doc(id)
			.set({ ...taskData }),
	]);

	console.log("newList", newList);

	// Re-order new list
	const newListReordered = [...newList.order];
	newListReordered.splice(newIndex, 0, taskId);
	return await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(newListId)
		.set({ order: newListReordered }, { merge: true });
};

// RE-ORDER LISTS
export const reorderLists = async ({ boardSlug, newIndex, oldIndex }) => {
	const { id: boardId, order: listsOrder } = await getBoardBySlug({ slug: boardSlug });
	const newListsOrder = [...listsOrder];
	const [listId] = newListsOrder.splice(oldIndex, 1);
	newListsOrder.splice(newIndex, 0, listId);
	await db.collection("boards").doc(boardId).set({ order: newListsOrder }, { merge: true });
};
