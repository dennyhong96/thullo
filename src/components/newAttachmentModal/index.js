import { useState } from "react";

import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import Image from "@/components/image";
import Modal from "@/components/modal";
import Button from "@/components/button";
import Input from "@/components/input";
import UploadButton from "@/components/uploadButotn";
import { StyledAttachmentModal } from "./styles";
import toBase64 from "@/utils/toBase64";

const NewAttachmentModal = ({ children, onClose, ...props }) => {
	const [attachmentTitle, setAttachmentTitle] = useState("");

	// `imageSrc` for preview
	const [imageSrc, setImageSrc] = useState("");
	const handleFile = async evt => {
		const file = evt.target.files?.[0];
		if (!file) return;
		console.log(file);
		const dataSrc = await toBase64(file);
		setImageSrc(dataSrc);
	};

	return (
		<Modal {...props} onClose={onClose} hasBackDrop={false}>
			<StyledAttachmentModal>
				{/* TITLE INPUT */}
				<h3>Add an attachment</h3>
				<Input
					placeholder="Attachment title..."
					value={attachmentTitle}
					onChange={evt => setAttachmentTitle(evt.target.value)}
				/>

				<Image aspectRatio="66.25%" src={imageSrc || IMAGE_PLACEHOLDER_SRC} />

				{/* ACTIONS */}
				<div>
					<UploadButton onChange={handleFile}>Pick a File</UploadButton>
					<Button onClick={onClose}>Cancel</Button>
					<Button>Upload</Button>
				</div>
			</StyledAttachmentModal>
		</Modal>
	);
};

export default NewAttachmentModal;
