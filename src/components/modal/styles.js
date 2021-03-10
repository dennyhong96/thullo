import styled from "styled-components";
import { StyledButton } from "@/components/button/styles";

export const StyledModal = styled.div`
	position: fixed;
	left: 50%;
	top: 0;
	margin-top: 10rem;
	transform: translate(-50%, 0);
	width: 90%;
	max-width: 35rem;
	background-color: #fff;
	box-shadow: ${({ theme }) => theme.boxShadow.card};
	border-radius: ${({ theme }) => theme.borderRadius.card};

	/* CLOSE BUTTON */
	& > ${StyledButton} {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1;
	}

	/* BODY */
	& > div {
		padding: 3rem;
	}
`;

export const StyledBackdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.15);
`;
