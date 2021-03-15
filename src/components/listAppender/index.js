import useCreateList from "@/hooks/useCreateList";
import Button from "@/components/button";
import { IconAdd } from "@/components/icons";
import Input from "@/components/input";
import { StyledList } from "./styles";

const ListAppender = () => {
	const {
		register,
		handleSubmit,
		taskTitle,
		handleTitleInput,
		isAdding,
		toggleAddList,
	} = useCreateList();

	return (
		<StyledList>
			{isAdding ? (
				<form onSubmit={handleSubmit}>
					<Input name="title" ref={register} value={taskTitle} onChange={handleTitleInput} />
					<div>
						<Button type="button" onClick={toggleAddList} isGhost>
							Cancel
						</Button>
						<Button type="submit">Create</Button>
					</div>
				</form>
			) : (
				<Button Icon={<IconAdd />} isToggable onClick={toggleAddList}>
					Add a new list
				</Button>
			)}
		</StyledList>
	);
};

export default ListAppender;
