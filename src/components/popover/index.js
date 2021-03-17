import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import useClickOutside from "@/hooks/useClickOutside";
import generateId from "@/utils/generateId";
import { StyledPopover, StyledPopoverBody } from "./styles";

const POPOVER_VARIANTS = {
	initial: { opacity: 0, x: "-50%", scale: 0.9, transition: { duration: 0.3 } },
	animate: { opacity: 1, x: "-50%", scale: 1, transition: { duration: 0.15 } },
};

const Popover = ({ Trigger, children }) => {
	const popoverRef = useRef();
	const keyRef = useRef(generateId());

	// In order to safely use ref as effect dependency
	const popoverContentRef = useRef();
	const setPopoverContentRef = useCallback(node => {
		if (popoverContentRef.current) {
			// Make sure to cleanup any events/references added to the last instance
		}
		if (node) {
			// Check if a node is actually passed. Otherwise node would be null.
			// You can now do what you need to, addEventListeners, measure, etc.
		}
		// Save a reference to the node
		popoverContentRef.current = node;
	}, []);

	const [show, setShow] = useState(false);
	useClickOutside({
		ref: popoverContentRef,
		callback: setShow.bind(this, false),
		show,
	});

	const [rect, setRect] = useState(null);
	useEffect(() => {
		if (!popoverRef.current) return;

		function updateRect() {
			setRect(popoverRef.current?.getBoundingClientRect());
		}

		updateRect();
		window.addEventListener("resize", updateRect);
		window.addEventListener("scroll", updateRect, true);
		return () => {
			window.removeEventListener("resize", updateRect);
			window.removeEventListener("scroll", updateRect, true);
		};
	}, [popoverRef.current, show]);

	const ClonedTrigger = cloneElement(Trigger, {
		onClick: setShow.bind(this, true),
		ref: popoverRef,
	});

	// Popover is out of screen on the left
	const leftBounded =
		rect?.left + rect?.width / 2 - popoverContentRef?.current?.getBoundingClientRect().width / 2 <
		0;

	return (
		<StyledPopover>
			{/* POPOVER TRIGGER */}
			{ClonedTrigger}

			{/* POPOVER BODY */}
			{process.browser &&
				createPortal(
					<AnimatePresence>
						{show ? (
							<StyledPopoverBody
								ref={setPopoverContentRef}
								left={
									rect
										? leftBounded
											? popoverContentRef.current?.getBoundingClientRect().width / 2
											: rect.left + rect.width / 2
										: 0
								}
								top={rect?.bottom ?? 0}
								// Framer Motion
								initial="initial"
								animate="animate"
								exit="initial"
								variants={POPOVER_VARIANTS}
								key={keyRef.current}
							>
								{children}
							</StyledPopoverBody>
						) : null}
					</AnimatePresence>,
					document.body,
				)}
		</StyledPopover>
	);
};

export default Popover;
