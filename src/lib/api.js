import firebase from "./firebase";
import toSlug from "@/utils/toSlug";
import sortByLastest from "@/utils/sortByLatest";

const db = firebase.firestore();
const storage = firebase.storage();

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

// LIST ALL TASK LISTS OF A BOARD
export const listListsByBoard = async ({ boardSlug }) => {
	const board = await getBoardBySlug({ slug: boardSlug });
	const { id: boardId, order: listsOrder } = board;

	const listSnapshots = await db.collection("boards").doc(boardId).collection("lists").get();

	const lists = {};
	listSnapshots.forEach(doc => {
		const id = doc.id;
		lists[id] = { id, ...doc.data() };
	});

	return {
		...board,
		lists: await Promise.all(
			listsOrder.map(async listId => ({
				...lists[listId],
				tasks: await listTasksByList({
					boardSlug,
					listSlug: lists[listId].slug,
				}),
			})),
		),
	};
};

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
			const [comments, attachments] = await Promise.all([
				await listCommentsByTask({ boardId, listId, taskId: task.id }),
				await listAttachmentsByTask({ boardId, listId, taskId: task.id }),
			]);

			return {
				...task,
				comments,
				attachments,
			};
		}),
	);
};

// LIST COMMENTS OF A TASK
const listCommentsByTask = async ({ boardId, listId, taskId }) => {
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

// LIST ATTACHEMENTS OF A TASK
const listAttachmentsByTask = async ({ boardId, listId, taskId }) => {
	const attachmentSnapshots = await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId)
		.collection("attachments")
		.get();

	const attachments = [];
	attachmentSnapshots.forEach(doc => attachments.push({ id: doc.id, ...doc.data() }));
	const sortedAttachments = sortByLastest(attachments);

	return await Promise.all(
		sortedAttachments.map(async attachment => ({
			...attachment,
			attachmentSrc: await storage.ref(attachment.attachmentPath).getDownloadURL(),
		})),
	);
};

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
			}),
	]);
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

// ADD AN ATTACHMENT TO A TASK
export const createTaskAttachment = async ({ boardSlug, listId, taskId, id, title, file }) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
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

	const attachmentTitleSlug = toSlug(title);
	const fileExt = file.type.split("/")[1];
	const filePath = `/boards/${boardSlug}/${listSlug}/${taskSlug}/${attachmentTitleSlug}.${fileExt}`;

	await Promise.all([
		await storage.ref(filePath).put(file),
		await db
			.collection("boards")
			.doc(boardId)
			.collection("lists")
			.doc(listId)
			.collection("tasks")
			.doc(taskId)
			.collection("attachments")
			.doc(id)
			.set({
				id,
				title,
				slug: attachmentTitleSlug,
				attachmentPath: filePath,
				createdAt: firebase.firestore.Timestamp.now(),
			}),
	]);
};

// ---------------------------------------------------------------------------------------------------
// ----------------------------------------- HANDLE RE-ORDER -----------------------------------------
// ---------------------------------------------------------------------------------------------------

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
