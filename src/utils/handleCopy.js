const handleCopy = text => {
	if (!navigator.clipboard) {
		handleCopyFallback(text);
		return;
	}
	navigator.clipboard.writeText(text).then(
		function () {},
		function (err) {
			console.error(err);
		},
	);
};

const handleCopyFallback = text => {
	const textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.width = "0";
	textArea.style.height = "0";
	textArea.style.opacity = "0";
	textArea.style.overflow = "hidden";
	textArea.style.position = "fixed";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	document.execCommand("copy");
	document.body.removeChild(textArea);
};

export default handleCopy;
