import styled from "styled-components";

import useTaskComment from "@/hooks/useTaskComment";
import Image from "@/components/image";
import Modal from "@/components/modal";
import Comment from "@/components/comment";
import Button from "@/components/button";
import CommentInput from "@/components/commentInput";
import Attachment from "@/components/attachment";
import UploadButton from "@/components/uploadButotn";
import useTaskCover from "@/hooks/useTaskCover";
import { StyledButton } from "@/components/button/styles";
import { IconMembers, IconImage } from "@/components/icons";
import TaskDescription from "@/components/taskDescripiton";
import TaskLabels from "@/components/taskLabels";
import LabelPopover from "@/components/labelPopover";
import { StyledEditTaskModalBody } from "./styles";

const StyledActions = styled.div`
	display: grid;
	gap: 1rem;

	${StyledButton} {
		width: 100%;
		height: max-content;
	}
`;

const EditTaskModal = ({
	children,
	// List -
	listId,
	listTitle,
	// Task -
	taskId,
	cover,
	title,
	comments,
	attachments,
	description,
	labels,
	// Other -
	...props
}) => {
	// HANDLES TASK COMMENT STATE AND MUTATION
	const { commentInput, setCommentInput, register, handleSubmit } = useTaskComment({
		listId,
		taskId,
	});

	// HANDLES TASK COVER UPLOAD
	const { fileSrc, handleTaskCover } = useTaskCover({ listId, taskId });

	return (
		<Modal {...props} size="lg">
			<StyledEditTaskModalBody>
				<div>
					{/* TASK COVER IMAGE */}
					<Image
						aspectRatio="21.1%"
						src={cover?.src || fileSrc || `http://via.placeholder.com/1280x200?text=cover`}
					/>
					<div>
						{/* MAIN */}
						<div>
							{/* TITLE */}
							<h3>{title}</h3>
							<p>In list: {listTitle}</p>

							{/* LABELS */}
							<TaskLabels labels={labels} />

							{/* DESCRIPTION */}
							<TaskDescription description={description} listId={listId} taskId={taskId} />

							{/* ATTACHMENTS */}
							<Attachment.Container listId={listId} taskId={taskId}>
								{attachments?.length ? (
									attachments.map((attachment, idx) => (
										<Attachment key={idx} attachment={attachment} listId={listId} taskId={taskId} />
									))
								) : (
									<p>No attachments...</p>
								)}
							</Attachment.Container>

							{/* COMMENTS INPUT */}
							<CommentInput
								name="comment"
								onSubmit={handleSubmit}
								ref={register}
								onChange={evt => setCommentInput(evt.target.value)}
							>
								{commentInput}
							</CommentInput>

							{/* COMMENTS */}
							<Comment.Container>
								{comments?.map(comment => (
									<Comment key={comment.id} body={comment.body} date={comment.createdAt.seconds} />
								))}
							</Comment.Container>
						</div>

						{/* SIDEBAR */}
						<StyledActions>
							{/* ACTIONS */}
							<span>actions</span>

							{/* ADD / REMOVE MEMBERS */}
							<Button isToggable Icon={<IconMembers />}>
								Members
							</Button>

							{/* ADD / REMOVE LABELS */}
							<LabelPopover listId={listId} taskId={taskId} labels={labels} />

							{/* ADD COVER */}
							<UploadButton isToggable Icon={<IconImage />} onChange={handleTaskCover}>
								Cover
							</UploadButton>
						</StyledActions>
					</div>
				</div>
			</StyledEditTaskModalBody>
		</Modal>
	);
};

export default EditTaskModal;
