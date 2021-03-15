import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { createTask } from "@/lib/api/tasks";
import toSlug from "@/utils/toSlug";

const useCreateTask = ({ listSlug, listId }) => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	const mutation = useMutation(({ id, title }) => createTask({ boardSlug, listSlug, id, title }), {
		// OPTIMISTIC UI
		onMutate({ id, title }) {
			const slug = toSlug(title);
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
										{
											id,
											title,
											slug,
										},
									],
									order: [...(list.order || []), id],
							  }
							: { ...list },
					),
				};
			});
		},
	});

	return {
		mutation,
	};
};

export default useCreateTask;
