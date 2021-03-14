import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { createComment, editTaskDescription } from "@/lib/api";
import generateId from "@/utils/generateId";
import Image from "@/components/image";
import Modal from "@/components/modal";
import Comment from "@/components/comment";
import Button from "@/components/button";
import CommentInput from "@/components/commentInput";
import Attachment from "@/components/attachment";
import Editor from "@/components/editor";
import { IconEdit, IconMembers, IconLabels, IconImage } from "@/components/icons";
import { StyledButton } from "@/components/button/styles";
import Popover from "@/components/popover";
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
	listId,
	listTitle,
	taskId,
	title,
	comments,
	attachments,
	description,
	...props
}) => {
	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;

	const commentMutation = useMutation(
		// DB
		({ id, comment }) => {
			return createComment({ boardSlug, listId, taskId, id, comment });
		},
		// LOCAL CACHE
		{
			onMutate({ id, comment }) {
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
														comments: [
															{
																id,
																body: comment,
																createdAt: {
																	seconds: Date.now(),
																},
															},
															...(task.comments ?? []),
														],
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

	// DESCRIPTION
	const descriptionMutation = useMutation(
		// DB
		({ description }) => {
			return editTaskDescription({ boardSlug, listId, taskId, description });
		},
		// LOCAL CACHE
		{
			onMutate({ description }) {
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
														description,
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

	// COMMENT INPT FORM
	const [commentInput, setCommentInput] = useState("");
	const { register, handleSubmit } = useForm();
	const onSubmit = ({ comment }) => {
		const id = generateId();
		commentMutation.mutate({ id, comment });
		setCommentInput("");
	};
	const onError = () => {};

	// EDITOR
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [taskDescription, setDescription] = useState(
		description || "<p>Click 'Edit' to edit description.</p>",
	);
	const handleUpdateDescription = () => {
		setIsEditorOpen(false);
		if (taskDescription === description) return;
		descriptionMutation.mutate({ description: taskDescription });
	};

	return (
		<Modal {...props} size="lg">
			<StyledEditTaskModalBody>
				<div>
					<Image aspectRatio="21.1%" src={`http://via.placeholder.com/1280x200?text=cover`} />
					<div className="">
						{/* MAIN */}
						<div className="">
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
								onSubmit={handleSubmit(onSubmit, onError)}
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
							<Button isToggable Icon={<IconImage />}>
								Cover
							</Button>
						</StyledActions>
					</div>
				</div>
			</StyledEditTaskModalBody>
		</Modal>
	);
};

export default EditTaskModal;
