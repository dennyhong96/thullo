import styled from "styled-components";

export const StyledDescription = styled.div`
	& > div:first-of-type {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
`;

export const StyledDescriptioContent = styled.div`
	border-radius: ${({ theme }) => theme.borderRadius.card};
	border: 1px solid ${({ theme }) => theme.colors.textLight};
	box-shadow: ${({ theme }) => theme.boxShadow.search};
	padding: 2rem;
`;
