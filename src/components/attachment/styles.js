import styled from "styled-components";

import { StyledImage } from "@/components/image/styles";
import { StyledButton } from "../button/styles";

export const StyledAttachment = styled.div`
	display: grid;
	grid-template-columns: 10rem 1fr;
	align-items: center;
	gap: 2rem;

	${StyledImage} {
		border-radius: ${({ theme }) => theme.borderRadius.button};
	}

	& > div:last-of-type {
		& > div {
			display: flex;
			align-items: center;

			& > ${StyledButton}:not(:last-of-type) {
				margin-right: 1rem;
			}
		}
	}
`;

export const StyledAttachments = styled.div`
	${StyledAttachment}:not(:last-of-type) {
		padding-bottom: 2rem;
	}
`;

export const StyledAttachmentContainer = styled.div`
	margin-bottom: 2rem;

	& > div:first-of-type {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
`;
