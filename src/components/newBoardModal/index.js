import React from "react";
import styled from "styled-components";

import Modal from "@/components/modal";
import Image from "@/components/image";
import Button from "@/components/button";
import { StyledImage } from "@/components/image/styles";
import { IconLock, IconImage, IconAdd } from "@/components/icons";
import UploadButton from "../uploadButotn";

const StyledModalBody = styled.div`
	& > ${StyledImage} {
		border-radius: ${({ theme }) => theme.borderRadius.card};
	}

	display: grid;
	gap: 2rem;
`;

const StyledInput = styled.input`
	width: 100%;
	padding: 1rem 2rem;
	font-weight: 500;
	font-size: 1rem;
	line-height: 1.5;
	box-shadow: ${({ theme }) => theme.boxShadow.search};
	border: 1px solid ${({ theme }) => theme.colors.textLightest};
	border-radius: ${({ theme }) => theme.borderRadius.button};

	&::placeholder {
		color: ${({ theme }) => theme.colors.textLightest};
	}
`;

const StyledNewBoardOptions = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const StyledModalActions = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const NewBoardModal = ({ ...props }) => {
	return (
		<Modal {...props}>
			<StyledModalBody>
				<Image
					aspectRatio="30%"
					src="https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1498&q=80"
				/>

				<StyledInput placeholder="Add board title" />

				<StyledNewBoardOptions>
					<UploadButton isToggable Icon={<IconImage />}>
						Cover
					</UploadButton>

					<Button Icon={<IconLock />} isToggable>
						Private
					</Button>
				</StyledNewBoardOptions>

				<StyledModalActions>
					<Button isGhost>Cancel</Button>

					<Button Icon={<IconAdd />}>Create</Button>
				</StyledModalActions>
			</StyledModalBody>
		</Modal>
	);
};

export default NewBoardModal;
