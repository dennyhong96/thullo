import { forwardRef } from "react";

import { StyledButton } from "./styles";

const Button = forwardRef(({ children, Icon, ...props }, ref) => {
	return (
		<StyledButton ref={ref} iconOnly={!!Icon && !children} {...props}>
			{!!Icon && Icon}
			{!!children && <span>{children}</span>}
		</StyledButton>
	);
});

Button.displayName = "Button";

export default Button;
