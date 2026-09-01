import { useAppearance } from "../customizables/AppearanceContext.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { ThemeProvider } from "@emotion/react";

//#region src/styledSystem/InternalThemeProvider.tsx
const InternalThemeProvider = (props) => {
	const { parsedInternalTheme } = useAppearance();
	return /* @__PURE__ */ jsx(ThemeProvider, {
		theme: parsedInternalTheme,
		children: props.children
	});
};

//#endregion
export { InternalThemeProvider };
//# sourceMappingURL=InternalThemeProvider.js.map