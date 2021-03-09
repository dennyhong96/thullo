import styled from "styled-components";

import { StyledImage } from "@/components/image/styles";

export const StyledModalBody = styled.div`
	& > ${StyledImage} {
		border-radius: ${({ theme }) => theme.borderRadius.card};
	}

	display: grid;
	gap: 2rem;
`;

export const StyledNewBoardOptions = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const StyledModalActions = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;
