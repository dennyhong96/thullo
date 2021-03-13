import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import Button from "@/components/button";
import Image from "@/components/image";
import { StyledAttachment, StyledAttachments, StyledAttachmentContainer } from "./styles";
import { Fragment, useState } from "react";
import NewAttachmentModal from "../newAttachmentModal";

const Attachment = () => {
	return (
		<StyledAttachment>
			{/* ATTACHMENT IMAGE */}
			<Image aspectRatio="66.25%" src={IMAGE_PLACEHOLDER_SRC} />

			{/* ATTACHMENT INFO */}
			<div>
				<span>Added July 5, 2020</span>
				<p>next.config.js</p>
				<div>
					<Button isToggable>Download</Button>
					<Button isToggable>Delete</Button>
				</div>
			</div>
		</StyledAttachment>
	);
};

const AttachmentsContainer = ({ children }) => {
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
			<NewAttachmentModal isOpen={isModalOpen} onClose={setIsModalOpen.bind(this, false)} />
		</Fragment>
	);
};

Attachment.Container = AttachmentsContainer;
export default Attachment;
