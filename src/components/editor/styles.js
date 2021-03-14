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
