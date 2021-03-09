import styled from "styled-components";

export const StyledImage = styled.div`
	position: relative;
	overflow: hidden;

	&::after {
		content: "";
		display: block;
		padding-bottom: ${({ aspectRatio }) => aspectRatio};
	}

	img {
		object-fit: cover;
	}
`;
