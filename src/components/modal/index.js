import { Fragment } from "react";
import { createPortal } from "react-dom";

import Button from "@/components/button";
import { IconClose } from "@/components/icons";
import { StyledModal, StyledBackdrop } from "./styles";

const Modal = ({ children, isOpen, onClose, size, hasBackDrop = true }) => {
	return process.browser && isOpen
		? createPortal(
				<Fragment>
					{/* BACKDROP */}
					{hasBackDrop && <StyledBackdrop onClick={onClose} />}

					<StyledModal size={size}>
						{/* CLOSE BUTTON */}
						<Button Icon={<IconClose />} onClick={onClose} />

						{/* BODY */}
						<div>{children}</div>
					</StyledModal>
				</Fragment>,
				document.body,
		  )
		: null;
};

export default Modal;
