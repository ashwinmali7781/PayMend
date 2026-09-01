import { Alert } from "../Alert.js";
import { Collapsible } from "../Collapsible.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/Card/CardAlert.tsx
const CardAlert = React.memo((props) => {
	return /* @__PURE__ */ jsx(Collapsible, {
		open: Boolean(props.children),
		children: /* @__PURE__ */ jsx(Alert, {
			variant: "danger",
			...props
		})
	});
});

//#endregion
export { CardAlert };
//# sourceMappingURL=CardAlert.js.map