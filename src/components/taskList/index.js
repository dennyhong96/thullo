import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";

import useCreateTask from "@/hooks/useCreateTask";
import generateId from "@/utils/generateId";
import Button from "@/components/button";
import { IconAdd } from "@/components/icons";
import Input from "@/components/input";
import TaskCard from "@/components/taskCard";
import TaskListInner from "@/components/taskListInner";
import { StyledList } from "./styles";

const TaskList = forwardRef(({ index, listId, listSlug, title, tasks }, ref) => {
	// STATES
	const [isAdding, setIsAdding] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");

	// Create task mutation
	const { mutation } = useCreateTask({ listId, listSlug });

	const { register, handleSubmit } = useForm();
	const onSubmit = ({ title }) => {
		const id = generateId();
		mutation.mutate({ id, title });

		// Clear  & close title input
		setTaskTitle("");
		setIsAdding(false);
	};
	const onError = error => console.error(error);

	return (
		<Draggable draggableId={listId} index={index}>
			{provided => (
				<StyledList {...provided.draggableProps} ref={provided.innerRef}>
					{/* Draggable handle */}

					<h3 {...provided.dragHandleProps}>{title}</h3>

					{/* ADD TASK INPUT */}
					{isAdding ? (
						<form onSubmit={handleSubmit(onSubmit, onError)}>
							<Input
								name="title"
								ref={register}
								value={taskTitle}
								onChange={evt => setTaskTitle(evt.target.value)}
							/>
							<div>
								<Button type="button" onClick={setIsAdding.bind(this, false)} isGhost>
									Cancel
								</Button>
								<Button type="submit">Create</Button>
							</div>
						</form>
					) : (
						<Button Icon={<IconAdd />} isToggable onClick={setIsAdding.bind(this, true)}>
							Add a new task
						</Button>
					)}

					{/* TASKS */}
					<Droppable droppableId={listId} type="TASKS">
						{(provider, snapshot) => (
							<TaskListInner
								listId={listId}
								isDraggingOver={snapshot.isDraggingOver}
								{...provider.droppableProps}
								ref={provider.innerRef}
							>
								{tasks?.map((task, idx) => (
									<TaskCard key={task.id} index={idx} listId={listId} {...task} />
								))}
								{provider.placeholder}
							</TaskListInner>
						)}
					</Droppable>
				</StyledList>
			)}
		</Draggable>
	);
});

export default TaskList;
