import { descriptors } from "../customizables/elementDescriptors.js";
import { Box, Spinner } from "../customizables/index.js";
import { forwardRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/common/InfiniteListSpinner.tsx
const InfiniteListSpinner = forwardRef((_, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		ref,
		sx: (t) => ({
			width: "100%",
			height: t.space.$12,
			position: "relative"
		}),
		children: /* @__PURE__ */ jsx(Box, {
			sx: {
				margin: "auto",
				position: "absolute",
				left: "50%",
				top: "50%",
				transform: "translateY(-50%) translateX(-50%)"
			},
			children: /* @__PURE__ */ jsx(Spinner, {
				size: "sm",
				colorScheme: "primary",
				elementDescriptor: descriptors.spinner
			})
		})
	});
});

//#endregion
export { InfiniteListSpinner };
//# sourceMappingURL=InfiniteListSpinner.js.map