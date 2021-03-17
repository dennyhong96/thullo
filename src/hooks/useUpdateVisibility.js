import { updateVisibility } from "@/lib/api/boards";
import { useMutation, useQueryClient } from "react-query";

import useBoardData from "./useBoardData";

const useUpdateVisibility = ({ onVisibilityChanged = () => {} } = {}) => {
	const client = useQueryClient();
	const { data: board } = useBoardData();

	const mutation = useMutation(
		({ isPrivate }) => {
			return updateVisibility({ boardId: board.id, isPrivate });
		},
		{
			async onMutate({ isPrivate }) {
				await client.cancelQueries("boards");

				const prevBoard = client.getQueryData("boards");

				client.setQueryData(["boards", board.slug], board => ({
					...board,
					isPrivate,
				}));

				return { prevBoard };
			},
			onError(err, _, { prevBoard }) {
				if (err) console.log(err);
				client.setQueryData("boards", prevBoard);
			},
			onSettled() {
				client.invalidateQueries("boards");
			},
		},
	);

	const handleUpdateVisibility = ({ isPrivate }) => {
		if (isPrivate === board.isPrivate) {
			return onVisibilityChanged();
		}
		mutation.mutate({ isPrivate });
		onVisibilityChanged();
	};

	return {
		handleUpdateVisibility,
	};
};

export default useUpdateVisibility;
