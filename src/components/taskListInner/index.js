import { forwardRef } from "react";

import { StyledTaskListInner } from "./styles";

const TaskListInner = forwardRef(({ children, isDraggingOver, ...props }, ref) => {
	return (
		<StyledTaskListInner ref={ref} isDraggingOver={isDraggingOver} {...props}>
			{children}
		</StyledTaskListInner>
	);
});

TaskListInner.displayName = "TaskListInner";

export default TaskListInner;
