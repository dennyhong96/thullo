import Link from "next/link";

import { IMAGE_PLACEHOLDER_SRC } from "@/lib/constants";
import Image from "@/components/image";
import { StyledBoardCard } from "./styles";

const BoardCard = ({
	href = "/",
	title = "Devchallengers Board",
	avatars = [],
	cover = IMAGE_PLACEHOLDER_SRC,
}) => {
	return (
		<Link href={href} passHref>
			<StyledBoardCard>
				{/* BOARD IMAGE */}
				<Image aspectRatio="60%" src={cover} />

				{/* BOARD NAME */}
				<h3>{title}</h3>

				{/* AVATARS */}
				<div>{!!avatars.length && avatars.map(Avatar => Avatar)}</div>
			</StyledBoardCard>
		</Link>
	);
};

export default BoardCard;
