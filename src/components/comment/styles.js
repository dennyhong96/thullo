import styled from "styled-components";

export const StyledComment = styled.div`
	padding: 2rem 0;

	& > div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;

		/* USER */
		& > div:first-of-type {
			display: flex;
			align-items: center;

			/* USERNAME + DATE */
			& > div:last-of-type {
				display: flex;
				flex-direction: column;
			}
		}

		/* ACTIONS */
		& > div:last-of-type {
			display: flex;
			align-items: center;
		}
	}

	/* BODY */
	& > p {
	}
`;

export const StyledContainer = styled.div`
	display: flex;
	flex-direction: column;

	& > ${StyledComment} {
		&:not(:last-of-type) {
			border-bottom: 1px solid ${({ theme }) => theme.colors.textLightest};
		}
	}
`;
