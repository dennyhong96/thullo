import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";

import { editTaskDescription } from "@/lib/api/tasks";

const useDescriptionEditor = ({ description, listId, taskId }) => {
	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;

	// DESCRIPTION
	const descriptionMutation = useMutation(
		// DB
		({ description }) => {
			return editTaskDescription({ boardSlug, listId, taskId, description });
		},
		// LOCAL CACHE
		{
			async onMutate({ description }) {
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
														description,
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

	// EDITOR
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [taskDescription, setDescription] = useState(
		description || "<p>Click 'Edit' to edit description.</p>",
	);

	const handleUpdateDescription = () => {
		setIsEditorOpen(false);
		if (taskDescription === description) return;
		descriptionMutation.mutate({ description: taskDescription });
	};

	return {
		isEditorOpen,
		setIsEditorOpen,
		taskDescription,
		setDescription,
		handleUpdateDescription,
	};
};

export default useDescriptionEditor;
