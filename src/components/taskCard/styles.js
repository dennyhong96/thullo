import styled, { css } from "styled-components";

export const StyledTaskCard = styled.div`
	border-radius: ${({ theme }) => theme.borderRadius.card};
	box-shadow: ${({ theme }) => theme.boxShadow.card};
	background-color: #fff;
	padding: 2rem;
	margin-bottom: 3rem;

	${({ isDragging }) =>
		isDragging &&
		css`
			color: red;
		`}
`;
