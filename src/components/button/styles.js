import styled from "styled-components";

export const StyledButton = styled.button`
	background: ${({ theme }) => theme.colors.blue};
	border-radius: ${({ theme }) => theme.borderRadius.button};
	color: #fff;
	padding: 1rem 2rem;
	font-weight: 500;
	font-size: 1.2rem;
	line-height: 1.5;
	display: flex;
	align-items: center;

	& > svg {
		height: 2rem;
		width: 2rem;
	}

	& > svg + span {
		margin-left: 0.5rem;
	}
`;
