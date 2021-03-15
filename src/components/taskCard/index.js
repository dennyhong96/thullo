import { Fragment, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

import Image from "@/components/image";
import EditTaskModal from "@/components/editTaskModal";
import { IconHandle } from "@/components/icons";
import { StyledTaskCard, StyledDragHandle } from "./styles";
import TaskLabels from "../taskLabels";

const TaskCard = ({
	index,
	listId,
	listTitle,
	id: taskId,
	title,
	cover,
	comments,
	attachments,
	description,
	labels,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<Fragment>
			<Draggable draggableId={taskId} index={index}>
				{(provided, snapshot) => (
					<StyledTaskCard
						onClick={setIsModalOpen.bind(this, true)}
						{...provided.draggableProps}
						ref={provided.innerRef}
						isDragging={snapshot.isDragging}
					>
						{/* DRAG HANDLE */}
						<StyledDragHandle {...provided.dragHandleProps}>
							<IconHandle />
						</StyledDragHandle>

						{cover && <Image aspectRatio="60%" src={cover.src} />}

						<TaskLabels labels={labels} />

						<div>{title}</div>
					</StyledTaskCard>
				)}
			</Draggable>

			{/* EDIT TASK MODAL */}
			<EditTaskModal
				isOpen={isModalOpen}
				onClose={setIsModalOpen.bind(this, false)}
				listId={listId}
				listTitle={listTitle}
				taskId={taskId}
				title={title}
				cover={cover}
				comments={comments}
				attachments={attachments}
				description={description}
				labels={labels}
			/>
		</Fragment>
	);
};

export default TaskCard;
