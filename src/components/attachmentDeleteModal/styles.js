import styled from "styled-components";
import { StyledButton } from "../button/styles";

export const StyledAttachmentDelete = styled.div`
	display: grid;
	gap: 1rem;

	& > h3 {
	}

	& > p {
	}

	& > div {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		& > ${StyledButton}:not(:last-of-type) {
			margin-right: 1rem;
		}
	}
`;
