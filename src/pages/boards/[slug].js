import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import useDnD from "@/hooks/useDnD";
import TaskList from "@/components/taskList";
import ListAppender from "@/components/listAppender";
import useBoardData from "@/hooks/useBoardData";

const StyledContainer = styled.div`
	overflow-x: auto;
	display: flex;
	width: max-content;
	padding: 0 4rem;
`;

const Boards = () => {
	const { data: board, error, isLoading } = useBoardData();
	if (error) console.error(error);

	// Handle drag end
	const { onDragEnd, onDragStart, onDragUpdate } = useDnD();

	if (isLoading) return <p>Loading...</p>;

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
