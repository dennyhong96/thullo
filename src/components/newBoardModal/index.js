import Modal from "@/components/modal";
import Image from "@/components/image";
import Button from "@/components/button";
import Input from "@/components/input";
import UploadButton from "@/components/uploadButotn";
import { IconLock, IconImage, IconAdd } from "@/components/icons";
import { StyledModalActions, StyledModalBody, StyledNewBoardOptions } from "./styles";

const NewBoardModal = ({ ...props }) => {
	const { onClose } = props;

	return (
		<Modal {...props}>
			<StyledModalBody>
				{/* BOARD IMAGE */}
				<Image
					aspectRatio="30%"
					src="https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1498&q=80"
				/>

				{/* BOARD TITLE INPUT */}
				<Input />

				<StyledNewBoardOptions>
					{/* IMAGE UPLAOD BUTTON */}
					<UploadButton isToggable Icon={<IconImage />}>
						Cover
					</UploadButton>

					{/* PRIVATE BUTTON */}
					<Button Icon={<IconLock />} isToggable>
						Private
					</Button>
				</StyledNewBoardOptions>

				<StyledModalActions>
					{/* CANCEL BUTTON */}
					<Button isGhost onClick={onClose}>
						Cancel
					</Button>

					{/* CREATE BUTTON */}
					<Button Icon={<IconAdd />}>Create</Button>
				</StyledModalActions>
			</StyledModalBody>
		</Modal>
	);
};

export default NewBoardModal;
