import Link from "next/link";
import Image from "@/components/image";
import { StyledAvatar } from "./styles";

const Avatar = ({ src }) => {
	return (
		<Link href="/" passHref>
			<StyledAvatar>
				<Image
					aspectRatio="100%"
					src={
						src ||
						"https://images.unsplash.com/photo-1556609567-eaaf38e79d07?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1502&q=80"
					}
				/>
			</StyledAvatar>
		</Link>
	);
};

export default Avatar;
