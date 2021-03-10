import { forwardRef } from "react";

import { StyledInput } from "./styles";

const Input = forwardRef(({ placeholder = "Add board title", ...props }, ref) => {
	return <StyledInput ref={ref} placeholder={placeholder} {...props} />;
});

Input.displayName = "Input";

export default Input;
