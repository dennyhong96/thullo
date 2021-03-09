import { useEffect, useState } from "react";

import debounce from "@/utils/debounce";

const useWindowResize = () => {
	const [windowSize, setWindowSize] = useState({
		width: process.browser ? window.innerWidth : 0,
		height: process.browser ? window.innerHeight : 0,
	});

	useEffect(() => {
		const resize = debounce(function () {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}, 100);

		resize();
		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);

	return { windowSize };
};

export default useWindowResize;
