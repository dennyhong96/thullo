import Modal from "@/components/modal";

import { StyledEditTaskModalBody } from "./styles";

const EditTaskModal = ({ children, ...props }) => {
	return (
		<Modal {...props} size="lg">
			<StyledEditTaskModalBody>{children}</StyledEditTaskModalBody>
		</Modal>
	);
};

export default EditTaskModal;
