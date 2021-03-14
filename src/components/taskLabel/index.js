import { StyledTaskLabel } from "./styles";

const TaskLabel = ({ label }) => {
	return <StyledTaskLabel bg={label.selectedColor}>{label.name}</StyledTaskLabel>;
};

export default TaskLabel;
