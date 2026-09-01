import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Span.tsx
const Span = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx("span", {
		...props,
		ref
	});
});

//#endregion
export { Span };
//# sourceMappingURL=Span.js.map