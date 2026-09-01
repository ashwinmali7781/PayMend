import { fromEntries } from "../utils/fromEntries.js";

//#region src/styledSystem/breakpoints.tsx
const breakpoints = Object.freeze({
	xs: "21em",
	sm: "30em",
	md: "48em",
	lg: "62em",
	xl: "80em",
	"2xl": "96em"
});
const deviceQueries = { ios: "@supports (-webkit-touch-callout: none)" };
const mqu = {
	...deviceQueries,
	...fromEntries(Object.entries(breakpoints).map(([k, v]) => [k, `@media (max-width: ${v})`]))
};

//#endregion
export { mqu };
//# sourceMappingURL=breakpoints.js.map