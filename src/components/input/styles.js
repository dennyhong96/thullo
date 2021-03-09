import styled from "styled-components";

export const StyledInput = styled.input`
	width: 100%;
	padding: 1rem 2rem;
	font-weight: 500;
	font-size: 1rem;
	line-height: 1.5;
	box-shadow: ${({ theme }) => theme.boxShadow.search};
	border: 1px solid ${({ theme }) => theme.colors.textLightest};
	border-radius: ${({ theme }) => theme.borderRadius.button};

	&::placeholder {
		color: ${({ theme }) => theme.colors.textLightest};
	}
`;
