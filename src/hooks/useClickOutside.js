import { useEffect } from "react";

const useClickOutside = ({ refs = [], callback = () => {} }) => {
	useEffect(() => {
		function handleClick(evt) {
			if (!refs.find(ref => ref.current === evt.target || ref.current?.contains(evt.target))) {
				callback();
			}
		}
		document.body.addEventListener("click", handleClick);
		return () => document.body.removeEventListener("click", handleClick);
	}, []);
	return null;
};

export default useClickOutside;
