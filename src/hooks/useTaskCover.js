import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useState } from "react";

import toBase64 from "@/utils/toBase64";
import { uploadTaskCover } from "@/lib/api";

const useTaskCover = ({ listId, taskId }) => {
	const [file, setFile] = useState(null);
	const [fileSrc, setFileSrc] = useState("");

	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;
	const mutation = useMutation(
		// DB
		({ file }) => {
			return uploadTaskCover({ boardSlug, listId, taskId, file });
		},
		// LOCAL CACHE
		{
			onMutate() {
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
														cover: {
															src: fileSrc,
															path: "",
														},
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

	const handleTaskCover = async evt => {
		const fileUploaded = evt.target.files[0];
		if (!fileUploaded) return;
		const src = await toBase64(fileUploaded);
		setFileSrc(src);
		setFile(fileUploaded);
		mutation.mutate({ file: fileUploaded });
	};

	return {
		fileSrc,
		file,
		handleTaskCover,
	};
};

export default useTaskCover;
