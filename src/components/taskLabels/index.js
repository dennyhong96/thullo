import useBoardData from "@/hooks/useBoardData";
import TaskLabel from "../taskLabel";

import { StyledTaskLabels } from "./styles";

const TaskLabels = ({ labels }) => {
	const { data: board } = useBoardData();

	return (
		<StyledTaskLabels>
			{labels?.map(label => {
				const currLabel = board?.labels?.find(lab => lab.id === label.id);
				return <TaskLabel label={currLabel} key={label.id} />;
			})}
		</StyledTaskLabels>
	);
};

export default TaskLabels;
