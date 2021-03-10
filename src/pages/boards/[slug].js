import { useRouter } from "next/router";
import { useQuery } from "react-query";
import styled from "styled-components";

import { listListsByBoard } from "@/lib/api";
import TaskList from "@/components/taskList";
import ListAppender from "@/components/listAppender";

const StyledContainer = styled.div`
	overflow-x: auto;
	display: flex;
	width: max-content;
	padding: 0 4rem;
`;

const Boards = () => {
	const router = useRouter();
	const boardSlug = router.query.slug;

	const { data: lists, error, isLoading } = useQuery(
		["listsByBoard", boardSlug],
		() => listListsByBoard({ boardSlug }),
		{ enabled: !!boardSlug },
	);

	if (isLoading) return <p>Loading...</p>;
	if (error) console.error(error);

	console.log(lists);

	return (
		<StyledContainer>
			{/* BACKLOG LIST */}
			{lists?.map(list => (
				<TaskList
					key={list.id}
					listId={list.id}
					title={list.title}
					tasks={list.tasks}
					listSlug={list.slug}
				/>
			))}

			{/* LIST APPENDER BUTTON */}
			<ListAppender />
		</StyledContainer>
	);
};

export default Boards;
