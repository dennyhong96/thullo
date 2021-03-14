import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { addTaskLabel } from "@/lib/api";
import generateId from "@/utils/generateId";
import toSlug from "@/utils/toSlug";

const useTaskLabels = ({ listId, taskId }) => {
	const [selectedColor, setSelectedColor] = useState("");
	const [label, setLabel] = useState("");

	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;

	// DESCRIPTION
	const mutation = useMutation(
		// DB
		({ id, slug, label, selectedColor }) => {
			return addTaskLabel({ boardSlug, listId, taskId, id, slug, label, selectedColor });
		},
		// LOCAL CACHE
		{
			onMutate({ id, slug, label, selectedColor }) {
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
														labels: [
															{
																id,
																createdAt: {
																	seconds: Date.now(),
																},
															},
															...(task.labels ?? []),
														],
												  }
												: { ...task },
										),
								  }
								: { ...list },
						),
						labels: [
							{
								id,
								slug,
								name: label,
								selectedColor,
								createdAt: {
									seconds: Date.now(),
								},
							},
							...(board.labels ?? []),
						],
					};
				});
			},
		},
	);

	const { register, handleSubmit } = useForm();
	const onSubmit = ({ label }) => {
		const id = generateId();
		const slug = toSlug(label);
		mutation.mutate({ id, slug, label, selectedColor });
		setSelectedColor("");
		setLabel("");
	};
	const onError = () => {};

	return {
		register,
		handleSubmit: handleSubmit(onSubmit, onError),
		selectedColor,
		setSelectedColor,
		label,
		setLabel,
	};
};

export default useTaskLabels;
