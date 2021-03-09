import styled from "styled-components";
import { StyledImage } from "@/components/image/styles";

export const StyledBoardCard = styled.a`
	background-color: #fff;
	padding: 1rem;
	color: ${({ theme }) => theme.colors.text};
	border-radius: ${({ theme }) => theme.borderRadius.card};
	box-shadow: ${({ theme }) => theme.boxShadow.card};

	& > ${StyledImage} {
		margin-bottom: 1.5rem;
		border-radius: ${({ theme }) => theme.borderRadius.card};
	}

	& > h3 {
		text-transform: initial;
		margin-bottom: 1.5rem;
	}

	/* AVARTARS CONTAINER */
	& > div {
		display: flex;
		flex-wrap: wrap;

		& > a:not(:last-of-type) {
			margin-right: 0.5rem;
		}
	}
`;
