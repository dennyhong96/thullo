import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import { listListsByBoard, reorderLists, reorderTaskList } from "@/lib/api";
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
	const client = useQueryClient();

	const { data: board, error, isLoading } = useQuery(
		["listsByBoard", boardSlug],
		() => listListsByBoard({ boardSlug }),
		{ enabled: !!boardSlug },
	);

	const mutation = useMutation(
		// Update DB
		({ type, props }) => {
			// TASKS DND
			if (type === "TASKS") {
				const { taskId, newListId, newIndex, oldListId, oldIndex } = props;
				return reorderTaskList({ boardSlug, taskId, newListId, newIndex, oldListId, oldIndex });
			}

			// LIST DND
			if (type === "LISTS") {
				const { listId, newIndex, oldIndex } = props;
				reorderLists({ boardSlug, listId, newIndex, oldIndex });
			}
		},
		// Update local cache
		{
			onMutate({ type, props }) {
				if (type === "LISTS") {
					const { newIndex, oldIndex } = props;
					return client.setQueryData(["listsByBoard", boardSlug], board => {
						const { order } = board;

						// Swap order
						const newOrder = [...order];
						const [listId] = newOrder.splice(oldIndex, 1);
						newOrder.splice(newIndex, 0, listId);

						const newLists = [...board.lists];
						const [list] = newLists.splice(oldIndex, 1);
						newLists.splice(newIndex, 0, list);

						return {
							...board,
							order: newOrder,
							// Swap list index
							lists: newLists,
						};
					});
				}

				const { taskId, newListId, newIndex, oldListId, oldIndex } = props;
				client.setQueryData(["listsByBoard", boardSlug], board => {
					const taskDropped = {
						...board.lists
							.find(list => list.id === oldListId)
							.tasks.find(task => task.id === taskId),
					};

					return {
						...board,
						lists: board.lists.map(list => {
							switch (list.id) {
								// Handle old list
								case oldListId: {
									// Moved with in the same list
									if (oldListId === newListId) {
										const newTasks = [...list.tasks];
										const [task] = newTasks.splice(oldIndex, 1);
										newTasks.splice(newIndex, 0, task);

										const newOrder = [...list.order];
										const [taskId] = newOrder.splice(oldIndex, 1);
										newOrder.splice(newIndex, 0, taskId);

										return {
											...list,
											order: newOrder,
											tasks: newTasks,
										};
									}

									// Moved across lists
									return {
										...list,
										order: list.order.filter(tId => tId !== taskId),
										tasks: list.tasks.filter(task => task.id !== taskId),
									};
								}

								// Handle new list
								case newListId: {
									// Task list could be empty first
									const newTasks = [...(list.tasks || [])];
									newTasks.splice(newIndex, 0, taskDropped);

									const newOrder = [...(list.order || [])];
									newOrder.splice(newIndex, 0, taskId);

									return { ...list, order: newOrder, tasks: newTasks };
								}

								// Handle other lists
								default: {
									return { ...list };
								}
							}
						}),
					};
				});
			},
		},
	);

	if (isLoading) return <p>Loading...</p>;
	if (error) console.error(error);

	const onDragEnd = result => {
		const { destination, type } = result;
		// No destination
		if (!destination) return;

		switch (type) {
			// Tasks re-ordered
			case "TASKS": {
				const { destination, source, draggableId: taskId } = result;
				const { droppableId: newListId, index: newIndex } = destination;
				const { droppableId: oldListId, index: oldIndex } = source;

				// Dropped back to source location
				if (newListId === oldListId && newIndex === oldIndex) return;

				return mutation.mutate({
					type: "TASKS",
					props: { taskId, newListId, newIndex, oldListId, oldIndex },
				});
			}

			// Lists re-ordered
			case "LISTS": {
				const { destination, source, draggableId: listId } = result;
				const { index: newIndex } = destination;
				const { index: oldIndex } = source;
				if (newIndex === oldIndex) return;

				return mutation.mutate({ type: "LISTS", props: { listId, newIndex, oldIndex } });
			}

			default: {
				break;
			}
		}
	};

	const onDragStart = () => {};

	const onDragUpdate = () => {};

	return (
		<DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
			<Droppable droppableId="task-lists" direction="horizontal" type="LISTS">
				{provided => (
					<StyledContainer {...provided.droppableProps} ref={provided.innerRef}>
						{/* BACKLOG LIST */}

						{board?.lists?.map((list, idx) => (
							<TaskList
								key={list.id}
								index={idx}
								listId={list.id}
								title={list.title}
								tasks={list.tasks}
								listSlug={list.slug}
							/>
						))}
						{provided.placeholder}

						{/* LIST APPENDER BUTTON */}
						<ListAppender />
					</StyledContainer>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default Boards;
