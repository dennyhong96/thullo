import useAddLabel from "@/hooks/useAddLabel";
import { StyledTaskLabel } from "./styles";

const TaskLabel = ({ label, id, listId, taskId, isAppendable = false }) => {
	const { handleClick } = useAddLabel({ id, listId, taskId });

	return (
		<StyledTaskLabel
			bg={label?.selectedColor}
			isAppendable={isAppendable}
			onClick={isAppendable ? handleClick : undefined}
		>
			{label.name}
		</StyledTaskLabel>
	);
};

export default TaskLabel;
