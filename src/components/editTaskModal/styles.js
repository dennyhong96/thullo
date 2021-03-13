import styled from "styled-components";

import { StyledImage } from "@/components/image/styles";

export const StyledEditTaskModalBody = styled.div`
	height: 100%;
	overflow-y: auto;

	& > div {
		/* TASK IMAGE */
		& > ${StyledImage} {
			border-radius: ${({ theme }) => theme.borderRadius.card};
		}

		/* BODY */
		& > div {
			display: grid;
			grid-template-columns: 1fr 15rem;
			gap: 2rem;
		}
	}
`;
