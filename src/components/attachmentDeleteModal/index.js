import Button from "@/components/button";
import Modal from "@/components/modal";
import useDeleteAttachment from "@/hooks/useDeleteAttachment";
import { StyledAttachmentDelete } from "./styles";

const AttachmentDeleteModal = ({
	onClose,
	title,
	attachmentId,
	attachmentPath,
	listId,
	taskId,
	...props
}) => {
	const { handleDelete } = useDeleteAttachment({
		listId,
		taskId,
		attachmentId,
		attachmentPath,
		onClose,
	});

	return (
		<Modal {...props} onClose={onClose} isOutlined>
			<StyledAttachmentDelete>
				<h3>Delete &quot;{title}&quot;</h3>
				<p>Are you sure you want to delete attachment &quot;{title}&quot;</p>

				<div>
					<Button onClick={onClose}>Cancel</Button>
					<Button isToggable onClick={handleDelete}>
						Delete
					</Button>
				</div>
			</StyledAttachmentDelete>
		</Modal>
	);
};

export default AttachmentDeleteModal;
