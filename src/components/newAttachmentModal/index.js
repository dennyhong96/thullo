import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import { createTaskAttachment } from "@/lib/api";
import toSlug from "@/utils/toSlug";
import toBase64 from "@/utils/toBase64";
import generateId from "@/utils/generateId";
import Image from "@/components/image";
import Modal from "@/components/modal";
import Button from "@/components/button";
import Input from "@/components/input";
import UploadButton from "@/components/uploadButotn";
import { StyledAttachmentModal } from "./styles";

const NewAttachmentModal = ({ listId, taskId, onClose, ...props }) => {
	const [attachmentTitle, setAttachmentTitle] = useState("");

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
			onMutate({ id, title }) {
				client.setQueryData(["listsByBoard", boardSlug], board => {
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
			},
		},
	);

	const { register, handleSubmit } = useForm();
	const onSubmit = ({ title }) => {
		const id = generateId();
		mutation.mutate({ id, title });
		setFile(null);
		setAttachmentTitle("");
		setImageSrc("");
		onClose();
	};
	const onError = () => {};

	return (
		<Modal {...props} onClose={onClose} hasBackDrop={false} isOutlined>
			<StyledAttachmentModal onSubmit={handleSubmit(onSubmit, onError)}>
				{/* TITLE INPUT */}
				<h3>Add an attachment</h3>
				<Input
					ref={register}
					name="title"
					placeholder="Attachment title..."
					value={attachmentTitle}
					onChange={evt => setAttachmentTitle(evt.target.value)}
				/>

				<Image
					aspectRatio="66.25%"
					// If file is image, display preview
					// Otherwise if there's file chosen, display file name
					// Display "file" if no file chosen
					src={
						(file &&
							(file.type.startsWith("image")
								? imageSrc
								: `http://via.placeholder.com/560x400?text=${toSlug(
										attachmentTitle || file.name,
								  )}`)) ||
						`http://via.placeholder.com/560x400?text=file`
					}
				/>

				{/* ACTIONS */}
				<div>
					<UploadButton type="button" onChange={handleFile}>
						Pick a File
					</UploadButton>
					<Button isToggable type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit">Confirm</Button>
				</div>
			</StyledAttachmentModal>
		</Modal>
	);
};

export default NewAttachmentModal;
