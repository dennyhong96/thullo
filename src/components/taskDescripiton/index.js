import useDescriptionEditor from "@/hooks/useDescriptionEditor";
import Button from "@/components/button";
import Editor from "@/components/editor";
import { IconEdit } from "@/components/icons";
import { StyledDescriptioContent, StyledDescription } from "./styles";

const TaskDescription = ({ description, listId, taskId }) => {
	// HANDLES TASK DESCRIPTION STATE AND MUTATION
	const {
		isEditorOpen,
		setIsEditorOpen,
		setDescription,
		taskDescription,
		handleUpdateDescription,
	} = useDescriptionEditor({ description, listId, taskId });

	return (
		<StyledDescription>
			<div>
				<span>Description</span>
				{!isEditorOpen && (
					<Button isGhost onClick={setIsEditorOpen.bind(this, true)} Icon={<IconEdit />}>
						Edit
					</Button>
				)}
			</div>

			{/* DESCRIPTION EDITOR */}
			{isEditorOpen ? (
				<Editor
					value={taskDescription}
					onChange={val => setDescription(val)}
					onUpdate={handleUpdateDescription}
				/>
			) : (
				<StyledDescriptioContent dangerouslySetInnerHTML={{ __html: taskDescription }} />
			)}
		</StyledDescription>
	);
};

export default TaskDescription;
