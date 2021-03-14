import styled from "styled-components";
import { StyledTaskLabel } from "../taskLabel/styles";

export const StyledTaskLabels = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;

	& > ${StyledTaskLabel} {
		margin-bottom: 0.5rem;

		&:not(:last-of-type) {
			margin-right: 0.5rem;
		}
	}
`;
