import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import styled from "styled-components";

import { listListsByBoard } from "@/lib/api";
import TaskList from "@/components/taskList";
import ListAppender from "@/components/listAppender";
import { DragDropContext } from "react-beautiful-dnd";

const StyledContainer = styled.div`
	overflow-x: auto;
	display: flex;
	width: max-content;
	padding: 0 4rem;
`;

const Boards = () => {
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();

	const { data: lists, error, isLoading } = useQuery(
		["listsByBoard", boardSlug],
		() => listListsByBoard({ boardSlug }),
		{ enabled: !!boardSlug },
	);

	if (isLoading) return <p>Loading...</p>;
	if (error) console.error(error);

	const onDragEnd = result => {
		const { destination, source, draggableId: taskId } = result;
		// No destination
		if (!destination) return;

		const { droppableId: newListId, index: newIndex } = destination;
		const { droppableId: oldListId, index: oldIndex } = source;

		// Dropped back to source location
		if (newListId === oldListId && newIndex === oldIndex) return;

		// Update cache
		client.setQueryData(["listsByBoard", boardSlug], lists => {
			console.log({ lists });

			const taskDropped = {
				...lists.find(list => list.id === oldListId).tasks.find(task => task.id === taskId),
			};

			return lists.map(list => {
				switch (list.id) {
					// Handle old list
					case oldListId: {
						// Moved with in the same list
						if (oldListId === newListId) {
							return {
								...list,
								tasks: list.tasks.map((task, idx) =>
									idx === newIndex
										? taskDropped
										: idx === oldIndex
										? { ...list.tasks[newIndex] }
										: { ...task },
								),
							};
						}

						// Moved across lists
						return { ...list, tasks: list.tasks.filter(task => task.id !== taskId) };
					}

					// Handle new list
					case newListId: {
						const newTasks = [...list.tasks];
						newTasks.splice(newIndex, 0, taskDropped);
						return { ...list, tasks: newTasks };
					}

					// Handle other lists
					default: {
						return { ...list };
					}
				}
			});
		});
	};

	const onDragStart = () => {};

	const onDragUpdate = () => {};

	return (
		<StyledContainer>
			{/* BACKLOG LIST */}
			<DragDropContext onDragStart={onDragStart} onDragUpdat={onDragUpdate} onDragEnd={onDragEnd}>
				{lists?.map((list, idx) => (
					<TaskList
						key={list.id}
						index={idx}
						listId={list.id}
						title={list.title}
						tasks={list.tasks}
						listSlug={list.slug}
					/>
				))}
			</DragDropContext>

			{/* LIST APPENDER BUTTON */}
			<ListAppender />
		</StyledContainer>
	);
};

export default Boards;
