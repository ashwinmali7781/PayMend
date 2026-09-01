import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flex, Text } from "../../customizables/index.js";
import { RouterLink } from "../RouterLink.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/Card/CardAction.tsx
const CardAction = (props) => {
	const { elementId, sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.footerAction,
		elementId: descriptors.footerAction.setId(elementId),
		...rest,
		gap: 1,
		sx: [(t) => ({ margin: `${t.space.$none} auto` }), sx]
	});
};
const CardActionText = (props) => {
	return /* @__PURE__ */ jsx(Text, {
		elementDescriptor: descriptors.footerActionText,
		...props,
		as: "span",
		variant: "body",
		colorScheme: "secondary"
	});
};
const CardActionLink = (props) => {
	return /* @__PURE__ */ jsx(RouterLink, {
		elementDescriptor: descriptors.footerActionLink,
		...props,
		colorScheme: "primary",
		variant: "buttonLarge"
	});
};

//#endregion
export { CardAction, CardActionLink, CardActionText };
//# sourceMappingURL=CardAction.js.map