import { forwardRef } from "react";

import Button from "@/components/button";
import { StyledInput } from "./styles";

const UploadButton = forwardRef(({ children, onChange, ...props }, ref) => {
	return (
		<Button ref={ref} {...props}>
			{children}
			<StyledInput type="file" onChange={onChange} />
		</Button>
	);
});

UploadButton.displayName = "UplaodButton";

export default UploadButton;
