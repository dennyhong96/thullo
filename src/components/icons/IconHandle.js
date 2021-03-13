import * as React from "react";

function SvgIconHandle(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			style={{
				msTransform: "rotate(360deg)",
				WebkitTransform: "rotate(360deg)",
			}}
			viewBox="0 0 36 36"
			transform="rotate(360)"
			{...props}
		>
			<circle
				cx={15}
				cy={12}
				r={1.5}
				className="icon-handle_svg__clr-i-outline icon-handle_svg__clr-i-outline-path-1"
				fill="currentColor"
			/>
			<circle
				cx={15}
				cy={24}
				r={1.5}
				className="icon-handle_svg__clr-i-outline icon-handle_svg__clr-i-outline-path-2"
				fill="currentColor"
			/>
			<circle
				cx={21}
				cy={12}
				r={1.5}
				className="icon-handle_svg__clr-i-outline icon-handle_svg__clr-i-outline-path-3"
				fill="currentColor"
			/>
			<circle
				cx={21}
				cy={24}
				r={1.5}
				className="icon-handle_svg__clr-i-outline icon-handle_svg__clr-i-outline-path-4"
				fill="currentColor"
			/>
			<circle
				cx={21}
				cy={18}
				r={1.5}
				className="icon-handle_svg__clr-i-outline icon-handle_svg__clr-i-outline-path-5"
				fill="currentColor"
			/>
			<circle
				cx={15}
				cy={18}
				r={1.5}
				className="icon-handle_svg__clr-i-outline icon-handle_svg__clr-i-outline-path-6"
				fill="currentColor"
			/>
		</svg>
	);
}

export default SvgIconHandle;
