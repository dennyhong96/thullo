import useClickOutside from "@/hooks/useClickOutside";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { StyledPopover, StyledPopoverBody } from "./styles";

const Popover = ({ Trigger, children }) => {
	const popoverRef = useRef();

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
			window.removeEventListener("scroll", updateRect);
		};
	}, [popoverRef.current]);

	const ClonedTrigger = cloneElement(Trigger, { onClick: setShow.bind(this, true) });

	return (
		<StyledPopover ref={popoverRef}>
			{/* POPOVER TRIGGER */}
			{ClonedTrigger}

			{/* POPOVER BODY */}
			{show &&
				process.browser &&
				createPortal(
					<StyledPopoverBody
						ref={setPopoverContentRef}
						left={rect ? rect.left + rect.width / 2 : 0}
						top={rect?.bottom ?? 0}
					>
						{children}
					</StyledPopoverBody>,
					document.body,
				)}
		</StyledPopover>
	);
};

export default Popover;
