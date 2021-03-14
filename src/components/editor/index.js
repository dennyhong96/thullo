import dynamic from "next/dynamic";

import Button from "@/components/button";
import { StyledEditor } from "./styles";

// ReactQuill doesn't support SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Editor = ({ value, onChange, onUpdate, updateButtonText = "Confirm" }) => {
	return (
		<StyledEditor>
			<ReactQuill value={value} onChange={onChange} />
			<Button onClick={onUpdate}>{updateButtonText}</Button>
		</StyledEditor>
	);
};

export default Editor;
