import Link from "next/link";

import Image from "@/components/image";
import { StyledBoardCard } from "./styles";

const BoardCard = ({
	title = "Devchallengers Board",
	avatars = [],
	imageSrc = "https://images.unsplash.com/photo-1615217482859-6b0c8a50129d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80",
}) => {
	return (
		<Link href="/" passHref>
			<StyledBoardCard>
				{/* BOARD IMAGE */}
				<Image aspectRatio="60%" src={imageSrc} />

				{/* BOARD NAME */}
				<h3>{title}</h3>

				{/* AVATARS */}
				<div>{!!avatars.length && avatars.map(Avatar => Avatar)}</div>
			</StyledBoardCard>
		</Link>
	);
};

export default BoardCard;
