import styled, { css } from "styled-components";

import { StyledImage } from "@/components/image/styles";

export const StyledDragHandle = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0;

	svg {
		height: 4rem;
		width: 4rem;
	}
`;

export const StyledTaskCard = styled.div`
	border-radius: ${({ theme }) => theme.borderRadius.card};
	box-shadow: ${({ theme }) => theme.boxShadow.card};
	background-color: #fff;
	padding: 2rem;
	margin-bottom: 3rem;
	position: relative;

	&:hover {
		& > ${StyledDragHandle} {
			opacity: 1;
		}
	}

	${({ isDragging }) =>
		isDragging &&
		css`
			color: red;
		`}

	${StyledImage} {
		border-radius: ${({ theme }) => theme.borderRadius.card};
	}
`;
