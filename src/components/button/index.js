import { StyledButton } from "./styles";

const Button = ({ children, Icon }) => {
	return (
		<StyledButton>
			{!!Icon && Icon}
			<span>{children}</span>
		</StyledButton>
	);
};

export default Button;
