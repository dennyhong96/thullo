import Link from "next/link";

import Image from "@/components/image";
import { StyledBoardCard } from "./styles";

const BoardCard = ({
	title = "Devchallengers Board",
	avatars = [],
	cover = "http://via.placeholder.com/1280x960?text=image",
}) => {
	return (
		<Link href="/" passHref>
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
