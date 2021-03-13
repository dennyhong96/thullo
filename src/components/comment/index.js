import Avatar from "@/components/avatar";
import Button from "@/components/button";
import formatDate from "@/utils/formatDate";
import { StyledComment, StyledContainer } from "./styles";

const Comment = ({ body, date }) => {
	return (
		<StyledComment>
			<div>
				{/* USER */}
				<div>
					<Avatar />
					<div>
						Denny Hong
						<span>{formatDate(date)}</span>
					</div>
				</div>

				{/* ACTIONS */}
				<div>
					<Button isGhost>Edit</Button>
					<Button isGhost>Delete</Button>
				</div>
			</div>

			{/* COMMENT BODY */}
			<p>{body}</p>
		</StyledComment>
	);
};

const CommentContainer = ({ children }) => {
	return <StyledContainer>{children}</StyledContainer>;
};

Comment.Container = CommentContainer;
export default Comment;
