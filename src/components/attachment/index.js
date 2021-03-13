import { Fragment, useState } from "react";

import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import formatDate from "@/utils/formatDate";
import Button from "@/components/button";
import Image from "@/components/image";
import NewAttachmentModal from "@/components/newAttachmentModal";
import { StyledAttachment, StyledAttachments, StyledAttachmentContainer } from "./styles";
import handleDownload from "@/utils/handleDownload";

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
					<Button
						isToggable
						onClick={handleDownload.bind(this, {
							fileName: "ttt.jpg",
							url: attachment.attachmentSrc,
						})}
					>
						Download
					</Button>
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
