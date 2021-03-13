import { Fragment, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import Image from "@/components/image";
import EditTaskModal from "@/components/editTaskModal";
import { IconHandle } from "@/components/icons";
import Button from "@/components/button";
import CommentInput from "@/components/commentInput";
import { StyledTaskCard, StyledDragHandle } from "./styles";
import { useRouter } from "next/router";
import generateId from "@/utils/generateId";

const TaskCard = ({ index, listId, id: taskId, title, comments }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;

	const mutation = useMutation(
		({ id, comment }) => {
			// DB
		},
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
															...(task.comments ?? []),
															{
																id,
																body: comment,
																createdAt: {
																	seconds: Date.now(),
																},
															},
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
	};
	const onError = () => {};

	return (
		<Fragment>
			<Draggable draggableId={taskId} index={index}>
				{(provided, snapshot) => (
					<StyledTaskCard
						onClick={setIsModalOpen.bind(this, true)}
						{...provided.draggableProps}
						ref={provided.innerRef}
						isDragging={snapshot.isDragging}
					>
						{/* DRAG HANDLE */}
						<StyledDragHandle {...provided.dragHandleProps}>
							<IconHandle />
						</StyledDragHandle>
						<div>{title}</div>
					</StyledTaskCard>
				)}
			</Draggable>

			{/* EDIT TASK MODAL */}
			<EditTaskModal isOpen={isModalOpen} onClose={setIsModalOpen.bind(this, false)}>
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
						<div className="">
							<span>Attachments</span>
							<Button>Add</Button>
						</div>

						{/* COMMENTS INPUT */}
						<CommentInput
							name="comment"
							onSubmit={handleSubmit(onSubmit, onError)}
							ref={register}
							onChange={evt => setCommentInput(evt.target.value)}
						>
							{commentInput}
						</CommentInput>

						{/* COMMENT */}
						{comments?.map(comment => (
							<p key={comment.id}>{comment.body}</p>
						))}
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
			</EditTaskModal>
		</Fragment>
	);
};

export default TaskCard;
