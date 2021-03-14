import styled from "styled-components";

export const StyledPopover = styled.div`
	position: relative;
`;

export const StyledPopoverBody = styled.div`
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translate(-50%, 0);
	background-color: #fff;
	padding: 2rem;
	z-index: 1;
	border-radius: ${({ theme }) => theme.borderRadius.card};
	box-shadow: ${({ theme }) => theme.boxShadow.card};
	border: 1px solid ${({ theme }) => theme.colors.textLight};
`;
