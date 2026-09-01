import { Flex } from "./Flex.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Form.tsx
const Form = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Flex, {
		direction: "col",
		as: "form",
		...props,
		ref
	});
});

//#endregion
export { Form };
//# sourceMappingURL=Form.js.map