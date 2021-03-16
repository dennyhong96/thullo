import styled from "styled-components";

import { StyledButton } from "@/components/button/styles";

export const StyledEditor = styled.div`
	position: relative;

	& > ${StyledButton} {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
	}
`;

export const StyledEditorLoader = styled.div`
	height: 20rem;
	border-radius: ${({ theme }) => theme.borderRadius.card};
	border: 1px solid ${({ theme }) => theme.colors.textLightest};
	box-shadow: ${({ theme }) => theme.boxShadow.card};
`;
