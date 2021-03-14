import toSlug from "@/utils/toSlug";
import firebase from "@/lib/firebase";
import { getBoardBySlug } from "./boards";
import { getListBySlug } from "./lists";
import { listCommentsByTask } from "./comments";
import { listAttachmentsByTask } from "./attachments";
import { listLabelsByTask } from "./labels";

const db = firebase.firestore();
const storage = firebase.storage();

// ADD A NEW TASK TO TASK LIST
export const createTask = async ({ boardSlug, listSlug, id, title }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	const list = await getListBySlug({ boardId, slug: listSlug });
	const { id: listId, order } = list;

	const taskSlug = toSlug(title);

	await Promise.all([
		// Store task order
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(listId)
			.set({ order: [...order, id] }, { merge: true }),
		// Store new task to list
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(listId)
			.collection("tasks")
			.doc(id)
			.set({
				title,
				slug: taskSlug,
				description: "<p>Click 'Edit' to edit description.</p>",
			}),
	]);
};

// LIST ALL TASKS OF A TASK LIST
export const listTasksByList = async ({ boardSlug, listSlug }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	const { id: listId, order: orderedTaskIds } = await getListBySlug({ boardId, slug: listSlug });

	const taskSnapshots = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.get();

	const tasks = {};
	taskSnapshots.forEach(doc => {
		const id = doc.id;
		tasks[id] = { id, ...doc.data() };
	});

	// Put tasks in order
	const orderedTasks = orderedTaskIds.map(taskId => tasks[taskId]);

	// Put comments into task
	return await Promise.all(
		orderedTasks.map(async task => {
			const [comments, attachments, labels, src] = await Promise.all([
				await listCommentsByTask({ boardId, listId, taskId: task.id }),
				await listAttachmentsByTask({ boardId, listId, taskId: task.id }),
				await listLabelsByTask({ boardId, listId, taskId: task.id }),
				...(task.cover?.path ? [await storage.ref(task.cover.path).getDownloadURL()] : []),
			]);

			return {
				...task,
				comments,
				attachments,
				labels,
				...(src ? { cover: { ...task.cover, src } } : {}),
			};
		}),
	);
};

// EDIT TASK DESCRIPTION
export const editTaskDescription = async ({ boardSlug, listId, taskId, description }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId)
		.set({ description }, { merge: true });
};

// UPLOAD A COVER FOR A TASK
export const uploadTaskCover = async ({ boardSlug, listId, taskId, file }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	const taskRef = db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId);
	const { slug } = await taskRef.get().then(doc => ({ id: doc.id, ...doc.data() }));

	const [{ slug: listSlug }, { slug: taskSlug }] = await Promise.all([
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(listId)
			.get()
			.then(doc => ({ id: doc.id, ...doc.data() })),
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(listId)
			.collection("tasks")
			.doc(taskId)
			.get()
			.then(doc => ({ id: doc.id, ...doc.data() })),
	]);

	const fileExt = file.type.split("/")[1];
	const path = `/boards/${boardSlug}/${listSlug}/${taskSlug}/${slug}.${fileExt}`;

	await Promise.all([
		await storage.ref(path).put(file),
		await taskRef.set({ cover: { path } }, { merge: true }),
	]);
};
