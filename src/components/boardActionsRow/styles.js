import styled from "styled-components";

import { StyledPopover } from "../popover/styles";

export const StyledActionRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	/* Left Side actions */
	& > div {
		display: flex;
		align-items: center;

		& > ${StyledPopover}:first-child {
			margin-right: 1rem;
		}

		/* Members */
		& > div {
			display: flex;

			& > *:not(:last-child) {
				margin-right: 1rem;
			}
		}
	}
`;

export const StyledVisibility = styled.div`
	& > p {
		font-weight: 600;
		font-size: 12px;
		line-height: 18px;
		letter-spacing: -0.035em;
	}

	& > span {
		font-size: 12px;
		line-height: 16px;
		letter-spacing: -0.035em;
		color: #828282;
	}
`;

export const StyledVisibilityOption = styled.button`
	&:not(:last-of-type) {
		margin-bottom: 1rem;
	}

	width: 100%;
	padding: 1rem;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	background: ${({ isActive }) => (isActive ? "#f2f2f2" : "#fff")};

	& > span:first-of-type {
		font-weight: 500;
		font-size: 12px;
		line-height: 16px;
		letter-spacing: -0.035em;
		color: #4f4f4f;

		& > svg {
			height: 1rem;
			width: 1rem;
		}
	}

	& > span:last-of-type {
		font-size: 10px;
		line-height: 14px;
		letter-spacing: -0.035em;
		color: #828282;
	}
`;
