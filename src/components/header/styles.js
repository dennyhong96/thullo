import styled from "styled-components";
import { StyledButton } from "../button/styles";
import { StyledInput } from "../input/styles";

export const StyledHeader = styled.header`
	padding: 2rem 4rem;
	display: grid;
	grid-template-columns: 1.25fr 2fr 1.75fr 2fr 1.25fr;
	gap: 1rem;
	align-items: center;
`;

export const StyledSearch = styled.div`
	position: relative;

	${StyledInput} {
		height: 4.5rem;
	}

	${StyledButton} {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translate3d(0, -50%, 0);
	}
`;
