import { deleteAttachment } from "@/lib/api/attachments";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

const useDeleteAttachment = ({ onClose, attachmentId, attachmentPath, listId, taskId }) => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	const mutation = useMutation(
		// DB
		({ boardSlug, listId, taskId, attachmentId }) => {
			return deleteAttachment({ boardSlug, listId, taskId, attachmentId, attachmentPath });
		},
		// LOCAL CACHE
		{
			async onMutate({ boardSlug, listId, taskId, attachmentId }) {
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
														attachments: task.attachments.filter(
															attachment => attachment.id !== attachmentId,
														),
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

	const handleDelete = () => {
		mutation.mutate({ boardSlug, listId, taskId, attachmentId });
		onClose();
	};

	return {
		handleDelete,
	};
};

export default useDeleteAttachment;
