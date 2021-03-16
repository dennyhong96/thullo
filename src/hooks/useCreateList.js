import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { createList } from "@/lib/api/lists";
import toSlug from "@/utils/toSlug";
import generateId from "@/utils/generateId";

const useCreateList = () => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	// STATES
	const [isAdding, setIsAdding] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");

	const mutation = useMutation(createList, {
		async onMutate({ id, title }) {
			await client.cancelQueries(["boards", boardSlug]);
			const prevBoard = client.getQueryData(["boards", boardSlug]);

			client.setQueryData(["boards", boardSlug], board => ({
				...board,
				lists: [...(board.lists || []), { id, title, slug: toSlug(title) }],
				order: [...(board.order || []), id],
			}));

			return { prevBoard };
		},
		onError(err, _, { prevBoard }) {
			if (err) console.log(err);
			client.setQueryData(["boards", boardSlug], prevBoard);
		},
		onSettled() {
			client.invalidateQueries(["boards", boardSlug]);
		},
	});

	// FORM
	const { register, handleSubmit: handleSub } = useForm();
	const onSubmit = ({ title }) => {
		const id = generateId();
		mutation.mutate({ boardSlug, id, title });

		// Clear  & close title input
		setTaskTitle("");
		setIsAdding(false);
	};
	const onError = error => console.error(error);
	const handleSubmit = handleSub(onSubmit, onError);

	const handleTitleInput = evt => setTaskTitle(evt.target.value);
	const toggleAddList = () => setIsAdding(prev => !prev);

	return {
		register,
		handleSubmit,
		taskTitle,
		handleTitleInput,
		isAdding,
		toggleAddList,
	};
};

export default useCreateList;
