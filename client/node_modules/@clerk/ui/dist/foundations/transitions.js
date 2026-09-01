//#region src/foundations/transitions.ts
const transitionDurationValues = Object.freeze({
	slowest: 600,
	slower: 280,
	slow: 200,
	fast: 120,
	focusRing: 200,
	controls: 100,
	textField: 450,
	drawer: 500
});
const toMs = (value) => `${value}ms`;
const transitionDuration = Object.freeze(Object.fromEntries(Object.entries(transitionDurationValues).map(([key, value]) => [key, toMs(value)])));
const transitionProperty = Object.freeze({ common: "background-color,background,border-color,color,fill,stroke,opacity,box-shadow,transform" });
const transitionTiming = Object.freeze({
	common: "ease",
	easeOut: "ease-out",
	bezier: "cubic-bezier(0.32, 0.72, 0, 1)",
	slowBezier: "cubic-bezier(0.16, 1, 0.3, 1)"
});

//#endregion
export { transitionDuration, transitionDurationValues, transitionProperty, transitionTiming };
//# sourceMappingURL=transitions.js.map