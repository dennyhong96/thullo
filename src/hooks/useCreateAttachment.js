import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import { createTaskAttachment } from "@/lib/api/attachments";
import toSlug from "@/utils/toSlug";
import toBase64 from "@/utils/toBase64";
import generateId from "@/utils/generateId";

const useCreateAttachment = ({ listId, taskId, onClose }) => {
	const [attachmentTitle, setAttachmentTitle] = useState("");

	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;
	const mutation = useMutation(
		// DB
		({ id, title }) => {
			return createTaskAttachment({ boardSlug, listId, taskId, id, title, file });
		},
		// LOCAL CACHE
		{
			async onMutate({ id, title }) {
				await client.cancelQueries(["boards", boardSlug]);
				const prevBoard = client.getQueryData(["boards", boardSlug]);

				client.setQueryData(["boards", boardSlug], board => {
					return {
						...board,
						lists: board.lists.map(list =>
							list.id === listId
								? {
										...list,
										tasks: list.tasks.map(task =>
											task.id === taskId
												? {
														...task,
														attachments: [
															{
																id,
																title,
																slug: toSlug(title),
																// attachmentPath: filePath,
																fileType: file.type,
																attachmentSrc: imageSrc,
																createdAt: {
																	seconds: Date.now(),
																},
															},
															...(task.attachments ?? []),
														],
												  }
												: { ...task },
										),
								  }
								: { ...list },
						),
					};
				});

				return { prevBoard };
			},
			onError(err, _, { prevBoard }) {
				if (err) console.log(err);
				client.setQueryData(["boards", boardSlug], prevBoard);
			},
			onSettled() {
				client.invalidateQueries(["boards", boardSlug]);
			},
		},
	);

	// `imageSrc` for preview
	const [imageSrc, setImageSrc] = useState("");
	const [file, setFile] = useState(null);
	const handleFile = async evt => {
		const uploadedFile = evt.target.files?.[0];
		if (!uploadedFile) return;
		setFile(uploadedFile);

		// Only set preview src if file is an image
		if (!uploadedFile.type.startsWith("image")) return;
		const dataSrc = await toBase64(uploadedFile);
		setImageSrc(dataSrc);
	};

	const { register, handleSubmit: handleSub } = useForm();
	const onSubmit = ({ title }) => {
		const id = generateId();
		mutation.mutate({ id, title });
		setFile(null);
		setAttachmentTitle("");
		setImageSrc("");
		onClose();
	};
	const onError = () => {};
	const handleSubmit = handleSub(onSubmit, onError);

	const handleTitle = evt => setAttachmentTitle(evt.target.value);

	return {
		register,
		handleSubmit,
		attachmentTitle,
		handleTitle,
		file,
		imageSrc,
		handleFile,
	};
};

export default useCreateAttachment;
