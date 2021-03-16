import useCreateAttachment from "@/hooks/useCreateAttachment";
import toSlug from "@/utils/toSlug";
import Image from "@/components/image";
import Modal from "@/components/modal";
import Button from "@/components/button";
import Input from "@/components/input";
import UploadButton from "@/components/uploadButotn";
import { StyledAttachmentModal } from "./styles";

const NewAttachmentModal = ({ listId, taskId, onClose, ...props }) => {
	const {
		register,
		handleSubmit,
		attachmentTitle,
		handleTitle,
		file,
		imageSrc,
		handleFile,
	} = useCreateAttachment({
		listId,
		taskId,
		onClose,
	});

	return (
		<Modal {...props} onClose={onClose} hasBackDrop={false} isOutlined>
			<StyledAttachmentModal onSubmit={handleSubmit}>
				{/* TITLE INPUT */}
				<h3>Add an attachment</h3>
				<Input
					ref={register}
					name="title"
					placeholder="Attachment title..."
					value={attachmentTitle}
					onChange={handleTitle}
				/>

				<Image
					aspectRatio="66.25%"
					// If file is image, display preview
					// Otherwise if there's file chosen, display file name
					// Display "file" if no file chosen
					src={
						(file &&
							(file.type.startsWith("image")
								? imageSrc
								: `http://via.placeholder.com/560x400?text=${toSlug(
										attachmentTitle || file.name,
								  )}`)) ||
						`http://via.placeholder.com/560x400?text=file`
					}
				/>

				{/* ACTIONS */}
				<div>
					<UploadButton type="button" onChange={handleFile}>
						Pick a File
					</UploadButton>
					<Button isToggable type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit">Confirm</Button>
				</div>
			</StyledAttachmentModal>
		</Modal>
	);
};

export default NewAttachmentModal;
