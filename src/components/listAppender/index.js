import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import { createList } from "@/lib/api";
import generateId from "@/utils/generateId";
import toSlug from "@/utils/toSlug";
import Button from "@/components/button";
import { IconAdd } from "@/components/icons";
import Input from "@/components/input";
import { StyledList } from "./styles";

const ListAppender = () => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	// STATES
	const [isAdding, setIsAdding] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");

	const mutation = useMutation(createList, {
		// OPTIMISTIC UI
		onMutate({ id, title }) {
			const slug = toSlug(title);
			client.setQueryData(["listsByBoard", boardSlug], old => [
				...old,
				{
					id,
					title,
					slug,
				},
			]);
		},
	});

	const { register, handleSubmit } = useForm();
	const onSubmit = ({ title }) => {
		const id = generateId();
		mutation.mutate({ boardSlug, id, title });

		// Clear  & close title input
		setTaskTitle("");
		setIsAdding(false);
	};
	const onError = error => console.error(error);

	return (
		<StyledList>
			{/* ADD TASK INPUT */}
			{isAdding ? (
				<form onSubmit={handleSubmit(onSubmit, onError)}>
					<Input
						name="title"
						ref={register}
						value={taskTitle}
						onChange={evt => setTaskTitle(evt.target.value)}
					/>
					<div>
						<Button type="button" onClick={setIsAdding.bind(this, false)} isGhost>
							Cancel
						</Button>
						<Button type="submit">Create</Button>
					</div>
				</form>
			) : (
				<Button Icon={<IconAdd />} isToggable onClick={setIsAdding.bind(this, true)}>
					Add a new list
				</Button>
			)}
		</StyledList>
	);
};

export default ListAppender;
