import styled, { css } from "styled-components";

export const StyledTaskLabel = styled.span`
	padding: 0.25rem 0.5rem;
	border-radius: ${({ theme }) => theme.borderRadius.button};
	background-color: ${({ bg }) => bg};
	font-weight: 500;
	font-size: 1rem;
	line-height: 1.4;
	letter-spacing: -0.035em;

	font-weight: 500;
	font-size: 1rem;
	line-height: 1.4;
	letter-spacing: -0.035em;

	${({ isAppendable }) =>
		isAppendable &&
		css`
			cursor: pointer;
		`}
`;
