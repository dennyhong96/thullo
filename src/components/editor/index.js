import ReactQuill from "react-quill";

import Button from "@/components/button";
import { StyledEditor } from "./styles";

const Editor = ({ value, onChange, onUpdate, updateButtonText = "Confirm" }) => {
	return (
		<StyledEditor>
			<ReactQuill value={value} onChange={onChange} />
			<Button onClick={onUpdate}>{updateButtonText}</Button>
		</StyledEditor>
	);
};

export default Editor;
