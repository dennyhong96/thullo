import Button from "@/components/button";
import { StyledInput } from "./styles";

const UploadButton = ({ children, onChange, ...props }) => {
	return (
		<Button {...props}>
			{children}
			<StyledInput type="file" onChange={onChange} />
		</Button>
	);
};

export default UploadButton;
