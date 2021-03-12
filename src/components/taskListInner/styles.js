import styled, { css } from "styled-components";

export const StyledTaskListInner = styled.div`
	min-height: 50rem;

	${({ isDraggingOver }) =>
		isDraggingOver &&
		css`
			border: 1px dashed #333;
		`}
`;
