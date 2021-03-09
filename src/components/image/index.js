import Image from "next/image";

import { StyledImage } from "./styles";

const styles = ({ src, aspectRatio = "56.25%" }) => {
	return (
		<StyledImage aspectRatio={aspectRatio}>
			<Image layout="fill" src={src} />
		</StyledImage>
	);
};

export default styles;
