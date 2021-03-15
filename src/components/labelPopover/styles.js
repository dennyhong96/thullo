import styled, { css } from "styled-components";

import { StyledTaskLabel } from "@/components/taskLabel/styles";

export const StyledLabelPopover = styled.form`
	width: 25rem;
	display: grid;
	gap: 1rem;
	justify-items: start;
`;

export const StyledColors = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1rem;
	width: 100%;
`;

export const StyledColor = styled.div`
	height: 3rem;
	cursor: pointer;
	transform: translate3d(0, 0, 0);
	background-color: ${({ color }) => color};
	border-radius: ${({ theme }) => theme.borderRadius.color};
	transition: ${({ theme }) => theme.transitions.normal};

	${({ isSelected, theme }) =>
		isSelected &&
		css`
			box-shadow: 0 0 0 2px ${theme.colors.textLightest};
			transform: scale(1.1);
		`}
`;

export const StyledAvailableLabels = styled.div`
	/* Title */
	& > p {
		display: flex;
		align-items: center;

		& > svg {
			height: 2rem;
			width: 2rem;
		}
	}

	/* Label container */
	& > div {
		display: flex;
		flex-wrap: wrap;

		& > ${StyledTaskLabel} {
			margin-bottom: 0.5rem;

			&:not(:last-of-type) {
				margin-right: 0.5rem;
			}
		}
	}
`;
