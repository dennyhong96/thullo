import styled from "styled-components";

export const StyledTaskLabel = styled.span`
	padding: 0.25rem 0.5rem;
	border-radius: ${({ theme }) => theme.borderRadius.button};
	background-color: ${({ bg }) => bg};
`;
