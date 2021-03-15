import firebase from "@/lib/firebase";
import toSlug from "@/utils/toSlug";
import sortByLastest from "@/utils/sortByLatest";
import { getBoardBySlug } from "./boards";

const db = firebase.firestore();
const storage = firebase.storage();

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
				fileType: file.type,
				createdAt: firebase.firestore.Timestamp.now(),
			}),
	]);
};

// LIST ATTACHEMENTS OF A TASK
export const listAttachmentsByTask = async ({ boardId, listId, taskId }) => {
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

// DELETE ATTACHMENT FROM TASK
export const deleteAttachment = async ({
	boardSlug,
	listId,
	taskId,
	attachmentId,
	attachmentPath,
}) => {
	const { id: boardId } = await getBoardBySlug({ slug: boardSlug });
	await storage.ref(attachmentPath).delete();
	await db
		.collection("boards")
		.doc(boardId)
		.collection("lists")
		.doc(listId)
		.collection("tasks")
		.doc(taskId)
		.collection("attachments")
		.doc(attachmentId)
		.delete();
};
