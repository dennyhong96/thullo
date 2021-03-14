import { useEffect } from "react";

const useClickOutside = ({ ref, callback, show }) => {
	useEffect(() => {
		if (!(show && ref.current)) return;
		// console.log("ref.current", ref.current);

		function handleClick(evt) {
			// console.log("ref.current", ref.current);
			// console.log("evt.target", evt.target);
			// console.log("equal", ref.current === evt.target);
			// console.log("contains", ref?.current.contains(evt.target));

			if (!(ref.current === evt.target || ref.current.contains(evt.target))) {
				callback();
			}
		}

		document.body.addEventListener("click", handleClick);
		return () => document.body.removeEventListener("click", handleClick);
	}, [show, ref.current]);

	return null;
};

export default useClickOutside;
