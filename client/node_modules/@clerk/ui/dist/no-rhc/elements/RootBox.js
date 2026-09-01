import { Col } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/RootBox.tsx
const RootBox = (props) => {
	return /* @__PURE__ */ jsx(Col, {
		...props,
		sx: (t) => ({
			boxSizing: "border-box",
			width: "fit-content",
			color: t.colors.$colorForeground,
			fontFamily: t.fonts.$main,
			fontStyle: t.fontStyles.$normal
		})
	});
};

//#endregion
export { RootBox };
//# sourceMappingURL=RootBox.js.map