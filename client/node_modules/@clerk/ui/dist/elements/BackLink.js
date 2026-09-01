import { localizationKeys } from "../localization/localizationKeys.js";
import { Flex, Text } from "../customizables/index.js";
import { RouterLink } from "./RouterLink.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/BackLink.tsx
const BackLink = (props) => {
	const { boxElementDescriptor, linkElementDescriptor, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: boxElementDescriptor,
		sx: (theme) => ({ margin: `${theme.space.$none} auto` }),
		children: /* @__PURE__ */ jsx(RouterLink, {
			...rest,
			children: /* @__PURE__ */ jsx(Text, {
				localizationKey: localizationKeys("backButton"),
				elementDescriptor: linkElementDescriptor,
				variant: "body"
			})
		})
	});
};

//#endregion
export { BackLink };
//# sourceMappingURL=BackLink.js.map