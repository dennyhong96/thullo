import Avatar from "@/components/avatar";

import Button from "@/components/button";
import { forwardRef } from "react";

import { StyledTextarea } from "./styles";

const CommentInput = forwardRef(({ children, onSubmit, ...props }, ref) => {
	return (
		<StyledTextarea {...props} onSubmit={onSubmit}>
			<div>
				<Avatar />
				<textarea ref={ref} value={children} placeholder="Write a comment..." {...props} />
			</div>
			<div>
				<Button type="submit">Comment</Button>
			</div>
		</StyledTextarea>
	);
});

CommentInput.displayName = "CommentInput";

export default CommentInput;
