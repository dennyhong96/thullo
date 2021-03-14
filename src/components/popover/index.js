import useClickOutside from "@/hooks/useClickOutside";
import { cloneElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StyledPopover, StyledPopoverBody } from "./styles";

const Popover = ({ Trigger, children }) => {
	const popoverRef = useRef();
	const popoverContentRef = useRef();

	const [show, setShow] = useState(false);
	useClickOutside({ refs: [popoverRef, popoverContentRef], callback: setShow.bind(this, false) });

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
						ref={popoverContentRef}
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
