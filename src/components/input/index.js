import { StyledInput } from "./styles";

const Input = ({ placeholder = "Add board title", ...props }) => {
	return <StyledInput placeholder={placeholder} {...props} />;
};

export default Input;
