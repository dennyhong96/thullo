import { Fragment } from "react";
import { createPortal } from "react-dom";

import Button from "@/components/button";
import { IconClose } from "@/components/icons";
import { StyledModal, StyledBackdrop } from "./styles";
import { AnimatePresence } from "framer-motion";

const MODAL_VARIANTS = {
	initial: {
		opacity: 0,
		x: "-50%",
		y: "calc(-50% + 2.5rem)",
		scale: 0.95,
		transition: { duration: 0.3 },
	},
	animate: {
		opacity: 1,
		x: "-50%",
		y: "-50%",
		scale: 1,
		transition: { duration: 0.15 },
	},
};

const MODAL_BACKDROP_VARIANTS = {
	initial: { opacity: 0, transition: { duration: 0.3 } },
	animate: { opacity: 1, transition: { duration: 0.15 } },
};

const Modal = ({ children, isOpen, onClose, size, hasBackDrop = true, isOutlined = false }) => {
	return process.browser
		? createPortal(
				<Fragment>
					{/* BACKDROP */}
					<AnimatePresence>
						{hasBackDrop && isOpen && (
							<StyledBackdrop
								key="54321"
								initial="initial"
								animate="animate"
								exit="initial"
								variants={MODAL_BACKDROP_VARIANTS}
								onClick={onClose}
							/>
						)}
					</AnimatePresence>

					<AnimatePresence>
						{isOpen && (
							<StyledModal
								key="12345"
								initial="initial"
								animate="animate"
								exit="initial"
								variants={MODAL_VARIANTS}
								size={size}
								isOutlined={isOutlined}
							>
								{/* CLOSE BUTTON */}
								<Button Icon={<IconClose />} onClick={onClose} />

								{/* BODY */}
								<div>{children}</div>
							</StyledModal>
						)}
					</AnimatePresence>
				</Fragment>,
				document.body,
		  )
		: null;
};

export default Modal;
