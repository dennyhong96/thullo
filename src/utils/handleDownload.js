const handleDownload = ({ url, fileName }) => {
	const postData = new FormData();
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "blob";
	xhr.onload = function (evt) {
		const blob = xhr.response;
		const fileDownloadName = `${fileName}`;
		saveOrOpenBlob(blob, fileDownloadName);
	};
	xhr.send(postData);
};

const saveOrOpenBlob = (blob, downloadName) => {
	const downloadLink = document.createElement("a");
	const url = window.URL.createObjectURL(blob);
	downloadLink.style.display = "none";
	downloadLink.href = url;
	downloadLink.download = downloadName;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	window.URL.revokeObjectURL(url);
	downloadLink.remove();
};

export default handleDownload;
