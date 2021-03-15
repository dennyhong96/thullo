import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import { createBoard } from "@/lib/api/boards";
import generateId from "@/utils/generateId";
import toSlug from "@/utils/toSlug";
import toBase64 from "@/utils/toBase64";

const useCreateBoard = ({ onBoardCreated }) => {
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
				await client.cancelQueries("boards");

				const prevBoards = client.getQueryData("boards");
				const coverSrc = await toBase64(cover);

				client.setQueryData("boards", old => [
					{
						id,
						title,
						isPrivate,
						slug: toSlug(title),
						cover: coverSrc,
						createdAt: {
							seconds: Date.now(),
						},
					},
					...old,
				]);

				return { prevBoards };
			},
			onError(err, _, { prevBoards }) {
				if (err) console.log(err);
				client.setQueryData("boards", prevBoards);
			},
			onSettled() {
				client.invalidateQueries("boards");
			},
		},
	);

	// Form validation
	const { register, handleSubmit: handleSub } = useForm();
	const onSubmit = async ({ title }) => {
		const id = generateId();
		mutation.mutate({ id, title, isPrivate, cover });

		// Close modal and reset form
		setTitle("");
		setIsPrivate(false);
		setCover(null);
		setCoverPreviewSrc("");
		onBoardCreated();
	};
	const onError = (errors, e) => console.error(errors, e);
	const handleSubmit = handleSub(onSubmit, onError);

	const handleTitle = evt => setTitle(evt.target.value);
	const handleTogglePrivate = () => setIsPrivate(prev => !prev);

	const handleCover = async evt => {
		const file = evt.target.files?.[0];
		if (!file) return;
		setCover(file);
		const prevewSrc = await toBase64(file);
		setCoverPreviewSrc(prevewSrc);
	};

	return {
		title,
		register,
		handleSubmit,
		handleTitle,
		isPrivate,
		handleTogglePrivate,
		handleCover,
		coverPreviewSrc,
	};
};

export default useCreateBoard;
