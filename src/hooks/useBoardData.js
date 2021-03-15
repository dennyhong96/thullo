import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { listListsByBoard } from "@/lib/api/lists";

const useBoardData = () => {
	const router = useRouter();
	const boardSlug = router.query.slug;

	const { data, error, isLoading } = useQuery(
		["listsByBoard", boardSlug],
		() => listListsByBoard({ boardSlug }),
		{ enabled: !!boardSlug },
	);

	return {
		data,
		error,
		isLoading,
	};
};

export default useBoardData;
