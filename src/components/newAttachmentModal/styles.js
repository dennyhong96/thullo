import styled from "styled-components";
import { StyledImage } from "../image/styles";
import { StyledInput } from "../input/styles";

export const StyledAttachmentModal = styled.form`
	& > h3 {
	}

	& > ${StyledImage} {
		border-radius: ${({ theme }) => theme.borderRadius.button};
	}

	& > ${StyledInput} {
	}

	& > div {
	}
`;
