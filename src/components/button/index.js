import { StyledButton } from "./styles";

const Button = ({ children, Icon, ...props }) => {
	return (
		<StyledButton {...props}>
			{!!Icon && Icon}
			<span>{children}</span>
		</StyledButton>
	);
};

export default Button;
