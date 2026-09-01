import { Box, Text } from "../customizables/index.js";
import { useDevMode } from "../hooks/useDevMode.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/DevModeNotice.tsx
const DEV_MODE_GRID = {
	width: 400,
	height: 60,
	squareSize: 1.5,
	gap: 2,
	minOpacity: .1,
	maxOpacity: .7,
	contrast: 2,
	fadeWidth: 45,
	fadeHeight: 20,
	fadeCenterY: 85,
	fadeStrength: .98,
	fadeCenter: .82,
	lineHeight: 1
};
const cellRandom = (x, y) => {
	let h = x * 374761393 + y * 668265263 + 2246822519 | 0;
	h = (h ^ h >>> 13) * 1274126177;
	return ((h ^ h >>> 16) >>> 0) / 4294967296;
};
const buildDevModeGridTile = (options) => {
	const step = options.squareSize + options.gap;
	const tileWidth = Math.max(1, Math.round(options.width / step)) * step;
	const tileHeight = options.height - options.lineHeight;
	let rects = "";
	for (let y = 0; y < tileHeight; y += step) for (let x = 0; x < tileWidth; x += step) {
		const opacity = options.minOpacity + (options.maxOpacity - options.minOpacity) * Math.pow(cellRandom(x, y), options.contrast);
		rects += `<rect x="${x}" y="${y}" width="${options.squareSize}" height="${options.squareSize}" fill="#fff" opacity="${opacity.toFixed(2)}"/>`;
	}
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${tileHeight}">${rects}</svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
const gridTile = buildDevModeGridTile(DEV_MODE_GRID);
const gridMask = `radial-gradient(ellipse ${DEV_MODE_GRID.fadeWidth}% ${DEV_MODE_GRID.fadeHeight / DEV_MODE_GRID.height * 100}% at 50% ${DEV_MODE_GRID.fadeCenterY}%, rgba(0,0,0,${DEV_MODE_GRID.fadeCenter}) 0%, rgba(0,0,0,${1 - DEV_MODE_GRID.fadeStrength}) 100%)`;
const lineMask = "linear-gradient(to right, transparent 2%, #000 50%, transparent 98%)";
const DevModeOverlay = () => {
	const { showDevModeNotice } = useDevMode();
	if (!showDevModeNotice) return null;
	return /* @__PURE__ */ jsxs(Box, {
		"data-clerk-dev-mode-overlay": "",
		sx: {
			userSelect: "none",
			pointerEvents: "none",
			insetInline: 0,
			bottom: 0,
			position: "absolute",
			height: DEV_MODE_GRID.height
		},
		children: [/* @__PURE__ */ jsx(Box, {
			sx: {
				position: "absolute",
				inset: 0,
				maskImage: gridMask,
				WebkitMaskImage: gridMask
			},
			children: /* @__PURE__ */ jsx(Box, { sx: (t) => ({
				position: "absolute",
				top: 0,
				insetInline: 0,
				bottom: DEV_MODE_GRID.lineHeight,
				backgroundColor: t.colors.$warning500,
				maskImage: gridTile,
				maskRepeat: "repeat-x",
				maskPosition: "left bottom",
				WebkitMaskImage: gridTile,
				WebkitMaskRepeat: "repeat-x",
				WebkitMaskPosition: "left bottom"
			}) })
		}), /* @__PURE__ */ jsx(Box, { sx: (t) => ({
			position: "absolute",
			insetInline: 0,
			bottom: 0,
			height: DEV_MODE_GRID.lineHeight,
			backgroundColor: t.colors.$warning500,
			maskImage: lineMask,
			WebkitMaskImage: lineMask
		}) })]
	});
};
const DevModeNotice = (props) => {
	const { sx } = props;
	const { showDevModeNotice } = useDevMode();
	if (!showDevModeNotice) return null;
	return /* @__PURE__ */ jsx(Text, {
		"data-clerk-dev-mode-notice": "",
		variant: "buttonSmall",
		sx: [(t) => ({
			color: t.colors.$warning500,
			padding: t.space.$1x5
		}), sx],
		children: "Development mode"
	});
};

//#endregion
export { DevModeNotice, DevModeOverlay };
//# sourceMappingURL=DevModeNotice.js.map