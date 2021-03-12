import { Draggable } from "react-beautiful-dnd";

import { StyledTaskCard } from "./styles";

const TaskCard = ({ index, listId, id: taskId, title }) => {
	return (
		<Draggable draggableId={taskId} index={index}>
			{(provided, snapshot) => (
				<StyledTaskCard
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					isDragging={snapshot.isDragging}
				>
					<div>{title}</div>
				</StyledTaskCard>
			)}
		</Draggable>
	);
};

export default TaskCard;
