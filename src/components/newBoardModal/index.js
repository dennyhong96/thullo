import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import { createBoard } from "@/lib/api/boards";
import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import generateId from "@/utils/generateId";
import toSlug from "@/utils/toSlug";
import toBase64 from "@/utils/toBase64";
import Modal from "@/components/modal";
import Image from "@/components/image";
import Button from "@/components/button";
import Input from "@/components/input";
import UploadButton from "@/components/uploadButotn";
import { IconLock, IconImage, IconAdd } from "@/components/icons";
import { StyledModalActions, StyledModalBody, StyledNewBoardOptions } from "./styles";

const NewBoardModal = ({ ...props }) => {
	const { onClose } = props;
	const client = useQueryClient();

	// States
	const [title, setTitle] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [cover, setCover] = useState(null);
	const [coverPreviewSrc, setCoverPreviewSrc] = useState("");

	// React query mutation
	const mutation = useMutation(
		({ id, title, isPrivate, cover }) => {
			return createBoard({ id, title, isPrivate, cover });
		},
		{
			async onMutate({ id, title, isPrivate, cover }) {
				// Optimistic UI
				const coverSrc = await toBase64(cover);
				const slug = toSlug(title);
				client.setQueryData("boards", old => [
					...old,
					{
						id,
						title,
						isPrivate,
						slug,
						cover: coverSrc,
						createdAt: {
							seconds: Date.now(),
						},
					},
				]);
			},
		},
	);

	// Form validation
	const { register, handleSubmit } = useForm();
	const onSubmit = async ({ title }) => {
		const id = generateId();
		mutation.mutate({ id, title, isPrivate, cover });

		// Close modal and reset form
		setTitle("");
		setIsPrivate(false);
		setCover(null);
		setCoverPreviewSrc("");
		onClose();
	};
	const onError = (errors, e) => console.error(errors, e);

	// Handle board title change
	const handleTitle = evt => setTitle(evt.target.value);

	// Handle toggle if board is private
	const handleTogglePrivate = () => setIsPrivate(prev => !prev);

	// Handle board cover image file
	const handleCover = async evt => {
		const file = evt.target.files?.[0];
		if (!file) return;
		setCover(file);
		const prevewSrc = await toBase64(file);
		setCoverPreviewSrc(prevewSrc);
	};

	return (
		<Modal {...props}>
			<StyledModalBody>
				{/* BOARD IMAGE */}
				<Image aspectRatio="30%" src={coverPreviewSrc || IMAGE_PLACEHOLDER_SRC} />

				{/* BOARD TITLE INPUT */}
				<form onSubmit={handleSubmit(onSubmit, onError)}>
					<Input name="title" value={title} onChange={handleTitle} ref={register} />

					<StyledNewBoardOptions>
						{/* IMAGE UPLAOD BUTTON */}
						<UploadButton
							type="button"
							isToggable
							isActive={!!cover}
							Icon={<IconImage />}
							onChange={handleCover}
						>
							Cover
						</UploadButton>

						{/* PRIVATE BUTTON */}
						<Button
							type="button"
							Icon={<IconLock />}
							isToggable
							isActive={isPrivate}
							onClick={handleTogglePrivate}
						>
							Private
						</Button>
					</StyledNewBoardOptions>

					<StyledModalActions>
						{/* CANCEL BUTTON */}
						<Button type="button" isGhost onClick={onClose}>
							Cancel
						</Button>

						{/* CREATE BUTTON */}
						<Button Icon={<IconAdd />}>Create</Button>
					</StyledModalActions>
				</form>
			</StyledModalBody>
		</Modal>
	);
};

export default NewBoardModal;
