import { useEffect } from "react";

const useClickOutside = ({ ref, callback = () => {} }) => {
	useEffect(() => {
		function handleClick(evt) {
			if (evt.target !== ref?.current && !ref?.current?.contains(evt.target)) {
				callback();
			}
		}
		document.body.addEventListener("click", handleClick);
		return () => document.body.removeEventListener("click", handleClick);
	}, []);
	return null;
};

export default useClickOutside;
