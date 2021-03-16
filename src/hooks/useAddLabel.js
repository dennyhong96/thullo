import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { addExistingLabel } from "@/lib/api/labels";

const useAddLabel = ({ id, listId, taskId }) => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	const mutation = useMutation(
		// DB
		({ id, listId, taskId }) => {
			return addExistingLabel({ boardSlug, id, listId, taskId });
		},
		// LOCAL CACHE
		{
			async onMutate({ id, listId, taskId }) {
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
														labels: [
															{ id, createdAt: { seconds: Date.now() } },
															...(task.labels ?? []),
														],
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

	const handleClick = async () => {
		mutation.mutate({ id, listId, taskId });
	};

	return {
		handleClick,
	};
};

export default useAddLabel;
