import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { createTask } from "@/lib/api/tasks";
import toSlug from "@/utils/toSlug";

const useCreateTask = ({ listSlug, listId }) => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	const mutation = useMutation(({ id, title }) => createTask({ boardSlug, listSlug, id, title }), {
		async onMutate({ id, title }) {
			await client.cancelQueries(["listsByBoard", boardSlug]);

			const prevBoard = client.getQueryData(["listsByBoard", boardSlug]);

			client.setQueryData(["listsByBoard", boardSlug], board => {
				return {
					...board,
					lists: board.lists.map(list =>
						list.id === listId
							? {
									...list,
									tasks: [
										// "tasks" could be undefined first
										...(list.tasks || []),
										{ id, title, slug: toSlug(title) },
									],
									order: [...(list.order || []), id],
							  }
							: { ...list },
					),
				};
			});

			return { prevBoard };
		},
		onError(err, _, { prevBoard }) {
			if (err) console.log(err);
			client.setQueryData(["listsByBoard", boardSlug], prevBoard);
		},
		onSettled() {
			client.invalidateQueries(["listsByBoard", boardSlug]);
		},
	});

	return {
		mutation,
	};
};

export default useCreateTask;
