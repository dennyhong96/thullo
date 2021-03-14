import firebase from "@/lib/firebase";
import sortByLastest from "@/utils/sortByLatest";
import { getBoardBySlug } from "./boards";

const db = firebase.firestore();

// LIST COMMENTS OF A TASK
export const listCommentsByTask = async ({ boardId, listId, taskId }) => {
	const commentSnapshots = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId)
		.collection("comments")
		.get();

	const comments = [];
	commentSnapshots.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));
	return sortByLastest(comments);
};

// ADD A COMMENT TO A TASK
export const createComment = async ({ boardSlug, listId, taskId, id, comment }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId)
		.collection("comments")
		.doc(id)
		.set({
			id,
			body: comment,
			createdAt: firebase.firestore.Timestamp.now(),
		});
};
