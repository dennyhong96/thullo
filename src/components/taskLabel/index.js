import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { addExistingLabel } from "@/lib/api/labels";
import { StyledTaskLabel } from "./styles";

const TaskLabel = ({ label, id, listId, taskId, isAppendable = false }) => {
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
			onMutate({ id, listId, taskId }) {
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
			},
		},
	);

	const handleClick = async () => {
		mutation.mutate({ id, listId, taskId });
	};

	return (
		<StyledTaskLabel
			bg={label?.selectedColor}
			isAppendable={isAppendable}
			onClick={isAppendable ? handleClick : undefined}
		>
			{label.name}
		</StyledTaskLabel>
	);
};

export default TaskLabel;
