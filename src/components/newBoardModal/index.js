import useCreateBoard from "@/hooks/useCreateBoard";
import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import Modal from "@/components/modal";
import Image from "@/components/image";
import Button from "@/components/button";
import Input from "@/components/input";
import UploadButton from "@/components/uploadButotn";
import { IconLock, IconImage, IconAdd } from "@/components/icons";
import { StyledModalActions, StyledModalBody, StyledNewBoardOptions } from "./styles";

const NewBoardModal = ({ ...props }) => {
	const { onClose } = props;
	const {
		title,
		register,
		handleSubmit,
		handleTitle,
		coverPreviewSrc,
		handleCover,
		isPrivate,
		handleTogglePrivate,
	} = useCreateBoard({ onBoardCreated: onClose });

	return (
		<Modal {...props}>
			<StyledModalBody>
				{/* BOARD IMAGE */}
				<Image aspectRatio="30%" src={coverPreviewSrc || IMAGE_PLACEHOLDER_SRC} />

				{/* BOARD TITLE INPUT */}
				<form onSubmit={handleSubmit}>
					<Input name="title" value={title} onChange={handleTitle} ref={register} />

					<StyledNewBoardOptions>
						{/* IMAGE UPLAOD BUTTON */}
						<UploadButton
							type="button"
							isToggable
							isActive={!!coverPreviewSrc}
							Icon={<IconImage />}
							onChange={handleCover}
						>
							Cover
						</UploadButton>

						{/* PRIVATE BUTTON */}
						<Button
							type="button"
							Icon={<IconLock />}
							isToggable
							isActive={isPrivate}
							onClick={handleTogglePrivate}
						>
							Private
						</Button>
					</StyledNewBoardOptions>

					<StyledModalActions>
						{/* CANCEL BUTTON */}
						<Button type="button" isGhost onClick={onClose}>
							Cancel
						</Button>

						{/* CREATE BUTTON */}
						<Button Icon={<IconAdd />}>Create</Button>
					</StyledModalActions>
				</form>
			</StyledModalBody>
		</Modal>
	);
};

export default NewBoardModal;
