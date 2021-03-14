import styled, { css } from "styled-components";

export const StyledButton = styled.button`
	background: ${({ theme }) => theme.colors.blue};
	color: #fff;
	border-radius: ${({ theme }) => theme.borderRadius.button};
	background: ${({ theme }) => theme.colors.blue};
	padding: 1rem 2rem;
	font-weight: 500;
	font-size: 1.2rem;
	line-height: 1.5;
	display: flex;
	align-items: center;
	position: relative;

	${({ iconOnly }) =>
		!!iconOnly &&
		css`
			padding: 1rem;
		`}

	${({ isToggable, isActive }) =>
		isToggable &&
		!isActive &&
		css`
			background: ${({ theme }) => theme.colors.background};
			color: ${({ theme }) => theme.colors.textLight};
		`}

	${({ isGhost }) =>
		isGhost &&
		css`
			background: transparent;
			color: ${({ theme }) => theme.colors.textLight};
		`}


	& > svg {
		height: 2rem;
		width: 2rem;
	}

	& > svg + span {
		margin-left: 0.5rem;
	}
`;
