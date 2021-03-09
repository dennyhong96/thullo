import styled from "styled-components";

export const StyledAvatar = styled.a`
	display: block;
	width: 4rem;
	height: 4rem;
	overflow: hidden;
	border-radius: ${({ theme }) => theme.borderRadius.button};
`;
