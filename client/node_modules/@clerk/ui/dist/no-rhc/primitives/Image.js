import { applyDataStateProps } from "./applyDataStateProps.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Image.tsx
const Image = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx("img", {
		crossOrigin: "anonymous",
		...applyDataStateProps(props),
		ref
	});
});

//#endregion
export { Image };
//# sourceMappingURL=Image.js.map