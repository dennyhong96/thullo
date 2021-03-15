import Button from "@/components/button";
import Modal from "@/components/modal";
import { deleteAttachment } from "@/lib/api/attachments";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
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
	const router = useRouter();
	const boardSlug = router.query.slug;
	const client = useQueryClient();
	const mutation = useMutation(
		// DB
		({ boardSlug, listId, taskId, attachmentId }) => {
			return deleteAttachment({ boardSlug, listId, taskId, attachmentId, attachmentPath });
		},
		// LOCAL CACHE
		{
			onMutate({ boardSlug, listId, taskId, attachmentId }) {
				client.setQueryData(["listsByBoard", boardSlug], board => {
					return {
						...board,
						lists: board.lists.map(list =>
							list.id === listId
								? {
										...list,
										tasks: list.tasks.map(task =>
											task.id === taskId
												? {
														...task,
														attachments: task.attachments.filter(
															attachment => attachment.id !== attachmentId,
														),
												  }
												: { ...task },
										),
								  }
								: { ...list },
						),
					};
				});
			},
		},
	);

	const handleDelete = () => {
		mutation.mutate({ boardSlug, listId, taskId, attachmentId });
		onClose();
	};

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
