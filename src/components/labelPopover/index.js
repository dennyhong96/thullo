import useBoardData from "@/hooks/useBoardData";
import useTaskLabels from "@/hooks/useTaskLabels";
import Button from "@/components/button";
import Popover from "@/components/popover";
import Input from "@/components/input";
import TaskLabel from "@/components/taskLabel";
import { IconLabels } from "@/components/icons";
import { StyledColor, StyledColors, StyledLabelPopover, StyledAvailableLabels } from "./styles";

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
	const {
		register,
		handleSubmit,
		selectedColor,
		setSelectedColor,
		label,
		setLabel,
	} = useTaskLabels({ listId, taskId });

	const { data: board } = useBoardData();

	return (
		<Popover
			Trigger={
				<Button isToggable Icon={<IconLabels />}>
					Labels
				</Button>
			}
		>
			<StyledLabelPopover onSubmit={handleSubmit}>
				<h3>Label</h3>
				<p>Select a name and a color</p>

				<Input
					placeholder="Label..."
					ref={register}
					name="label"
					value={label}
					onChange={evt => setLabel(evt.target.value)}
				/>

				{/* LABEL COLORS */}
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
				<StyledAvailableLabels>
					<p>
						<IconLabels /> Available
					</p>

					{/* FILTER OUT LABELS ALREADY ON THIS TASK */}
					<div>
						{board?.labels
							?.filter(lab => !labels?.find(label => label.id === lab.id))
							?.map(label => (
								<TaskLabel
									key={label.id}
									label={label}
									id={label.id}
									listId={listId}
									taskId={taskId}
									isAppendable
								/>
							))}
					</div>
				</StyledAvailableLabels>

				{/* ADD BUTTON */}
				<Button type="submit">Add</Button>
			</StyledLabelPopover>
		</Popover>
	);
};

export default LabelPopover;
