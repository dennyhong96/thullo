import useClickOutside from "@/hooks/useClickOutside";
import { cloneElement, useRef, useState } from "react";
import { StyledPopover, StyledPopoverBody } from "./styles";

const Popover = ({ Trigger, children }) => {
	const popoverRef = useRef();
	const [show, setShow] = useState(false);
	useClickOutside({ ref: popoverRef, callback: setShow.bind(this, false) });

	const ClonedTrigger = cloneElement(Trigger, { onClick: setShow.bind(this, true) });
	return (
		<StyledPopover ref={popoverRef}>
			{/* POPOVER TRIGGER */}
			{ClonedTrigger}

			{/* POPOVER BODY */}
			{show && <StyledPopoverBody>{children}</StyledPopoverBody>}
		</StyledPopover>
	);
};

export default Popover;
