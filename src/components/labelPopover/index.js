import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import useBoardData from "@/hooks/useBoardData";
import generateId from "@/utils/generateId";
import toSlug from "@/utils/toSlug";
import Button from "@/components/button";
import Popover from "@/components/popover";
import Input from "@/components/input";
import { IconLabels } from "@/components/icons";
import TaskLabel from "@/components/taskLabel";
import { StyledColor, StyledColors, StyledLabelPopover } from "./styles";
import { addTaskLabel } from "@/lib/api";

const COLORS = [
	"#219653",
	"#F2C94C",
	"#F2994A",
	"#EB5757",
	"#2F80ED",
	"#56CCF2",
	"#6FCF97",
	"#333333",
	"#4F4F4F",
	"#828282",
	"#BDBDBD",
	"#E0E0E0",
];

const LabelPopover = ({ listId, taskId, labels, ...props }) => {
	const [selectedColor, setSelectedColor] = useState("");
	const [label, setLabel] = useState("");

	const client = useQueryClient();
	const router = useRouter();
	const boardSlug = router.query.slug;

	// DESCRIPTION
	const mutation = useMutation(
		// DB
		({ id, slug, label, selectedColor }) => {
			return addTaskLabel({ boardSlug, listId, taskId, id, slug, label, selectedColor });
		},
		// LOCAL CACHE
		{
			onMutate({ id, slug, label, selectedColor }) {
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
														labels: [
															{
																id,
																createdAt: {
																	seconds: Date.now(),
																},
															},
															...(task.labels ?? []),
														],
												  }
												: { ...task },
										),
								  }
								: { ...list },
						),
						labels: [
							{
								id,
								slug,
								name: label,
								selectedColor,
								createdAt: {
									seconds: Date.now(),
								},
							},
							...(board.labels ?? []),
						],
					};
				});
			},
		},
	);

	const { register, handleSubmit } = useForm();
	const onSubmit = ({ label }) => {
		const id = generateId();
		const slug = toSlug(label);
		mutation.mutate({ id, slug, label, selectedColor });
		setSelectedColor("");
		setLabel("");
	};
	const onError = () => {};

	const { data: board } = useBoardData();

	return (
		<Popover
			Trigger={
				<Button isToggable Icon={<IconLabels />}>
					Labels
				</Button>
			}
		>
			<StyledLabelPopover onSubmit={handleSubmit(onSubmit, onError)}>
				<h3>Label</h3>
				<p>Select a name and a color</p>

				<Input
					placeholder="Label..."
					ref={register}
					name="label"
					value={label}
					onChange={evt => setLabel(evt.target.value)}
				/>

				{/*  */}
				<StyledColors>
					{COLORS.map(color => (
						<StyledColor
							key={color}
							onClick={setSelectedColor.bind(this, color)}
							color={color}
							isSelected={selectedColor === color}
						/>
					))}
				</StyledColors>

				{/* AVAILABLE LABELS */}
				<div className="">
					<p>
						<IconLabels /> Available
					</p>

					{/* FILTER OUT LABELS ALREADY ON THIS TASK */}
					<div className="">
						{board?.labels
							?.filter(lab => !labels?.find(label => label.id === lab.id))
							?.map(label => (
								<TaskLabel label={label} key={label.id} />
							))}
					</div>
				</div>

				{/*  */}
				<Button type="submit">Add</Button>
			</StyledLabelPopover>
		</Popover>
	);
};

export default LabelPopover;
