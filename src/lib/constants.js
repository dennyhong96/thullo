export const APP_HEADER_LINKS = [
	{ label: "overview", screen: "overview", tab: "about" },
	{ label: "design", screen: "design", tab: "colors" },
	{ label: "templates", screen: "templates", tab: "placeholder" },
	{ label: "content", screen: "content", tab: "placeholder" },
];

export const APP_SIDEBAR_LINKS = {
	overview: [
		{ label: "About", tab: "about" },
		{ label: "Location", tab: "location" },
	],
	design: [
		{ label: "Colors", tab: "colors" },
		{ label: "Typography", tab: "typography" },
		{ label: "Icons", tab: "icons" },
		{ label: "Photography", tab: "photography" },
		{ label: "Logos", tab: "logos" },
	],
	templates: [{ label: "Placeholder", tab: "placeholder" }],
	content: [{ label: "Placeholder", tab: "placeholder" }],
};

export const FILE_TYPE_EXTENTION_MAP = {
	"image/svg+xml": ".svg",
	"image/png": ".png",
};
