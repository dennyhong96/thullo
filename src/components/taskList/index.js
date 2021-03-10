import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import { createTask } from "@/lib/api";
import toSlug from "@/utils/toSlug";
import generateId from "@/utils/generateId";
import Button from "@/components/button";
import { IconAdd } from "@/components/icons";
import Input from "@/components/input";
import { StyledList, TaskCard } from "./styles";

const TaskList = ({ listId, listSlug, title, tasks }) => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	// STATES
	const [isAdding, setIsAdding] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");

	const mutation = useMutation(({ id, title }) => createTask({ boardSlug, listSlug, id, title }), {
		// OPTIMISTIC UI
		onMutate({ id, title }) {
			const slug = toSlug(title);
			client.setQueryData(["listsByBoard", boardSlug], old => {
				return old.map(list =>
					list.id === listId
						? {
								...list,
								tasks: [
									// "tasks" could be undefined first
									...(list.tasks || []),
									{
										id,
										title,
										slug,
									},
								],
						  }
						: { ...list },
				);
			});
		},
	});

	const { register, handleSubmit } = useForm();
	const onSubmit = ({ title }) => {
		const id = generateId();
		mutation.mutate({ id, title });

		// Clear  & close title input
		setTaskTitle("");
		setIsAdding(false);
	};
	const onError = error => console.error(error);

	return (
		<StyledList>
			<h3>{title}</h3>

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
					Add a new task
				</Button>
			)}

			{/* TASKS */}
			{tasks?.map(task => (
				<TaskCard key={task.id}>{task.title}</TaskCard>
			))}
		</StyledList>
	);
};

export default TaskList;
