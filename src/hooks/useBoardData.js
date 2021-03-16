import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { listListsByBoard } from "@/lib/api/lists";

const useBoardData = () => {
	const router = useRouter();
	const boardSlug = router.query.slug;

	const { data, error, isLoading } = useQuery(
		["boards", boardSlug],
		() => listListsByBoard({ boardSlug }),
		{ enabled: !!boardSlug, staleTime: 500 },
	);

	return {
		data,
		error,
		isLoading,
	};
};

export default useBoardData;
