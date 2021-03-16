import dynamic from "next/dynamic";

import Button from "@/components/button";
import { StyledEditor, StyledEditorLoader } from "./styles";

const EditorLoader = () => {
	return <StyledEditorLoader />;
};

// ReactQuill doesn't support SSR
const ReactQuill = dynamic(() => import("react-quill"), {
	ssr: false,
	loading: EditorLoader,
});

const Editor = ({ value, onChange, onUpdate, updateButtonText = "Confirm" }) => {
	return (
		<StyledEditor>
			<ReactQuill value={value} onChange={onChange} />
			<Button onClick={onUpdate}>{updateButtonText}</Button>
		</StyledEditor>
	);
};

export default Editor;
