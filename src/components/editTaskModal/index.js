import styled from "styled-components";

import useTaskComment from "@/hooks/useTaskComment";
import useDescriptionEditor from "@/hooks/useDescriptionEditor";
import Image from "@/components/image";
import Modal from "@/components/modal";
import Comment from "@/components/comment";
import Button from "@/components/button";
import CommentInput from "@/components/commentInput";
import Attachment from "@/components/attachment";
import Editor from "@/components/editor";
import Popover from "@/components/popover";
import UploadButton from "@/components/uploadButotn";
import useTaskCover from "@/hooks/useTaskCover";
import { StyledButton } from "@/components/button/styles";
import { IconEdit, IconMembers, IconLabels, IconImage } from "@/components/icons";
import { StyledEditTaskModalBody } from "./styles";

const StyledDescription = styled.div`
	& > div:first-of-type {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
`;

const StyledDescriptioContent = styled.div`
	border-radius: ${({ theme }) => theme.borderRadius.card};
	border: 1px solid ${({ theme }) => theme.colors.textLight};
	box-shadow: ${({ theme }) => theme.boxShadow.search};
	padding: 2rem;
`;

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
	...props
}) => {
	// HANDLES TASK COMMENT STATE AND MUTATION
	const { commentInput, setCommentInput, register, handleSubmit } = useTaskComment({
		listId,
		taskId,
	});

	// HANDLES TASK DESCRIPTION STATE AND MUTATION
	const {
		isEditorOpen,
		setIsEditorOpen,
		setDescription,
		taskDescription,
		handleUpdateDescription,
	} = useDescriptionEditor({ description, listId, taskId });

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

							{/* DESCRIPTION */}
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
							<Button isToggable Icon={<IconMembers />}>
								Members
							</Button>

							{/*  */}
							<Popover
								Trigger={
									<Button isToggable Icon={<IconLabels />}>
										Labels
									</Button>
								}
							>
								<div>hi</div>
							</Popover>

							{/*  */}
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
