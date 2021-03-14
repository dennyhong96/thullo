import styled from "styled-components";
import { StyledImage } from "../image/styles";
import { StyledInput } from "../input/styles";

export const StyledAttachmentModal = styled.form`
	display: grid;
	gap: 1rem;

	& > h3 {
	}

	& > ${StyledImage} {
		border-radius: ${({ theme }) => theme.borderRadius.button};
	}

	& > ${StyledInput} {
	}

	& > div {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
`;
