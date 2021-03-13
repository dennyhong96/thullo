import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import { createComment } from "@/lib/api";
import generateId from "@/utils/generateId";
import Image from "@/components/image";
import Modal from "@/components/modal";
import Comment from "@/components/comment";
import Button from "@/components/button";
import CommentInput from "@/components/commentInput";
import Attachment from "@/components/attachment";
import { StyledEditTaskModalBody } from "./styles";

const EditTaskModal = ({ children, listId, taskId, title, comments, ...props }) => {
	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;

	const mutation = useMutation(
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

	const [commentInput, setCommentInput] = useState("");
	const { register, handleSubmit } = useForm();
	const onSubmit = ({ comment }) => {
		const id = generateId();
		mutation.mutate({ id, comment });
		setCommentInput("");
	};
	const onError = () => {};

	return (
		<Modal {...props} size="lg">
			<StyledEditTaskModalBody>
				<div>
					<Image aspectRatio="21.1%" src={IMAGE_PLACEHOLDER_SRC} />
					<div className="">
						{/* MAIN */}
						<div className="">
							{/* TITLE */}
							<h3>{title}</h3>
							<p>In list:</p>

							{/* DESCRIPTION */}
							<div className="">
								<span>Description</span>
								<Button>Edit</Button>
							</div>
							<p>task description</p>

							{/* ATTACHMENTS */}
							<Attachment.Container>
								<Attachment />
								<Attachment />
								<Attachment />
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
						<div className="">
							{/* ACTIONS */}
							<span>actions</span>
							<Button>Members</Button>
							<Button>Labels</Button>
							<Button>Cover</Button>
						</div>
					</div>
				</div>
			</StyledEditTaskModalBody>
		</Modal>
	);
};

export default EditTaskModal;
