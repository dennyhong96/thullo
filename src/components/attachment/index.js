import { Fragment, useState } from "react";

import formatDate from "@/utils/formatDate";
import handleDownload from "@/utils/handleDownload";
import Button from "@/components/button";
import Image from "@/components/image";
import NewAttachmentModal from "@/components/newAttachmentModal";
import AttachmentDeleteModal from "@/components/attachmentDeleteModal";
import { StyledAttachment, StyledAttachments, StyledAttachmentContainer } from "./styles";
import { IconAdd } from "../icons";

const Attachment = ({ attachment, listId, taskId }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<Fragment>
			<StyledAttachment>
				{/* ATTACHMENT IMAGE */}
				<Image
					aspectRatio="66.25%"
					src={
						(attachment.fileType.startsWith("image") && attachment.attachmentSrc) ||
						`http://via.placeholder.com/420x300?text=${attachment.slug}`
					}
				/>

				{/* ATTACHMENT INFO */}
				<div>
					<span>{formatDate(attachment.createdAt.seconds)}</span>
					<p>{attachment.title}</p>
					<div>
						<Button
							isToggable
							onClick={handleDownload.bind(this, {
								fileName: `${attachment.slug}.${attachment.fileType.split("/")[1]}`,
								url: attachment.attachmentSrc,
							})}
						>
							Download
						</Button>
						<Button isToggable onClick={setIsModalOpen.bind(this, true)}>
							Delete
						</Button>
					</div>
				</div>
			</StyledAttachment>

			{/* DELETE ATTACHMENT MODAL */}
			<AttachmentDeleteModal
				title={attachment.title}
				attachmentId={attachment.id}
				attachmentPath={attachment.attachmentPath}
				listId={listId}
				taskId={taskId}
				isOpen={isModalOpen}
				onClose={setIsModalOpen.bind(this, false)}
			/>
		</Fragment>
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
					<Button isGhost Icon={<IconAdd />} onClick={setIsModalOpen.bind(this, true)}>
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
