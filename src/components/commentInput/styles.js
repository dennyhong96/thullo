import styled from "styled-components";

import { StyledAvatar } from "@/components/avatar/styles";
import { StyledButton } from "@/components/button/styles";

export const StyledTextarea = styled.form`
	position: relative;
	border-radius: ${({ theme }) => theme.borderRadius.card};
	border: 1px solid ${({ theme }) => theme.colors.textLight};
	overflow: hidden;

	& > div:first-of-type {
		width: 100%;
		display: grid;
		grid-template-columns: max-content 1fr;

		${StyledAvatar} {
			margin: 1rem 0 0 1rem;
		}
	}

	& > div:last-of-type {
		display: flex;
		justify-content: flex-end;

		${StyledButton} {
			margin: 0 1rem 1rem 0;
		}
	}

	textarea {
		font: inherit;
		display: block;
		width: 100%;
		height: max-content;
		resize: none;
		padding: 1rem;
		border: none;
	}
`;
