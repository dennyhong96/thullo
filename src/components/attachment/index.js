import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import Button from "@/components/button";
import Image from "@/components/image";
import { StyledAttachment, StyledAttachments, StyledAttachmentContainer } from "./styles";
import { Fragment, useState } from "react";
import NewAttachmentModal from "../newAttachmentModal";
import formatDate from "@/utils/formatDate";

const Attachment = ({ attachment }) => {
	return (
		<StyledAttachment>
			{/* ATTACHMENT IMAGE */}
			<Image aspectRatio="66.25%" src={attachment.attachmentSrc || IMAGE_PLACEHOLDER_SRC} />

			{/* ATTACHMENT INFO */}
			<div>
				<span>{formatDate(attachment.createdAt.seconds)}</span>
				<p>{attachment.title}</p>
				<div>
					<Button isToggable>Download</Button>
					<Button isToggable>Delete</Button>
				</div>
			</div>
		</StyledAttachment>
	);
};

const AttachmentsContainer = ({ children, listId, taskId }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<Fragment>
			<StyledAttachmentContainer>
				{/* TITLE ROW */}
				<div>
					<span>Attachments</span>
					<Button isGhost onClick={setIsModalOpen.bind(this, true)}>
						Add
					</Button>
				</div>

				{/* ATTACHEMENT ITEMS */}
				<StyledAttachments>{children}</StyledAttachments>
			</StyledAttachmentContainer>

			{/* ADD ATTACHMENT MODAL */}
			<NewAttachmentModal
				isOpen={isModalOpen}
				onClose={setIsModalOpen.bind(this, false)}
				listId={listId}
				taskId={taskId}
			/>
		</Fragment>
	);
};

Attachment.Container = AttachmentsContainer;
export default Attachment;
