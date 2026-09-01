import { fromEntries } from "../utils/fromEntries.js";

//#region src/styledSystem/createCssVariables.ts
const createCssVariables = (...names) => {
	return fromEntries(names.map((name) => [name, `var(--${name})`]));
};

//#endregion
export { createCssVariables };
//# sourceMappingURL=createCssVariables.js.map