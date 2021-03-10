import styled from "styled-components";

export const StyledList = styled.div`
	width: 30rem;

	&:not(:last-of-type) {
		margin-right: 5rem;
	}
`;

export const TaskCard = styled.div`
	border-radius: ${({ theme }) => theme.borderRadius.card};
	box-shadow: ${({ theme }) => theme.boxShadow.card};
	background-color: #fff;
	padding: 2rem;

	&:not(:last-of-type) {
		margin-bottom: 3rem;
	}
`;
