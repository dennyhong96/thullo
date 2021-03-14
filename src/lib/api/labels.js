import firebase from "@/lib/firebase";
import sortByLastest from "@/utils/sortByLatest";
import { getBoardBySlug } from "./boards";

const db = firebase.firestore();

// LIST LABELS BY BOARD
export const listLabelsByBoard = async ({ boardId }) => {
	const labels = [];
	const labelSnapshots = await db.collection("boards").doc(boardId).collection("labels").get();
	labelSnapshots.forEach(doc => labels.push({ id: doc.id, ...doc.data() }));
	return sortByLastest(labels);
};

// LIST LABELS BY TASK
export const listLabelsByTask = async ({ boardId, listId, taskId }) => {
	const labels = [];
	const labelSnapshots = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId)
		.collection("labels")
		.get();
	labelSnapshots.forEach(doc => labels.push({ id: doc.id, ...doc.data() }));
	return sortByLastest(labels);
};

// ADD A LABEL TO TASK
export const addTaskLabel = async ({
	boardSlug,
	listId,
	taskId,
	id,
	slug,
	label,
	selectedColor,
}) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	await Promise.all([
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(listId)
			.collection("tasks")
			.doc(taskId)
			.collection("labels")
			.doc(id)
			.set({
				createdAt: firebase.firestore.Timestamp.now(),
			}),
		await db.collection("boards").doc(boardId).collection("labels").doc(id).set({
			id,
			slug,
			name: label,
			selectedColor,
			createdAt: firebase.firestore.Timestamp.now(),
		}),
	]);
};

// ADD AN EXISTING LABEL TO TASK
export const addExistingLabel = async ({ boardSlug, id, listId, taskId }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId)
		.collection("labels")
		.doc(id)
		.set({
			createdAt: firebase.firestore.Timestamp.now(),
		});
};
