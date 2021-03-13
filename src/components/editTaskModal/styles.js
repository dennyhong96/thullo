import styled from "styled-components";

import { StyledImage } from "@/components/image/styles";

export const StyledEditTaskModalBody = styled.div`
	& > ${StyledImage} {
		border-radius: ${({ theme }) => theme.borderRadius.card};
	}
`;
