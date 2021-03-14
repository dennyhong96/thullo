import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createComment } from "@/lib/api";
import generateId from "@/utils/generateId";

const useTaskComment = ({ listId, taskId }) => {
	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;

	const commentMutation = useMutation(
		// DB
		({ id, comment }) => {
			return createComment({ boardSlug, listId, taskId, id, comment });
		},
		// LOCAL CACHE
		{
			onMutate({ id, comment }) {
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
														comments: [
															{
																id,
																body: comment,
																createdAt: {
																	seconds: Date.now(),
																},
															},
															...(task.comments ?? []),
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

	// COMMENT INPT FORM
	const [commentInput, setCommentInput] = useState("");
	const { register, handleSubmit: submitHandler } = useForm();

	const onSubmit = ({ comment }) => {
		const id = generateId();
		commentMutation.mutate({ id, comment });
		setCommentInput("");
	};
	const onError = () => {};

	const handleSubmit = submitHandler(onSubmit, onError);

	return {
		commentInput,
		setCommentInput,
		register,
		handleSubmit,
	};
};

export default useTaskComment;
