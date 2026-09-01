import { localizationKeys } from "../localization/localizationKeys.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Text } from "../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Divider.tsx
const Divider = (props) => {
	const { dividerText, ...rest } = props;
	return /* @__PURE__ */ jsxs(Flex, {
		center: true,
		elementDescriptor: descriptors.dividerRow,
		...rest,
		children: [
			/* @__PURE__ */ jsx(DividerLine, {}),
			/* @__PURE__ */ jsx(Text, {
				localizationKey: !dividerText ? localizationKeys("dividerText") : dividerText,
				elementDescriptor: descriptors.dividerText,
				variant: "body",
				colorScheme: "secondary",
				sx: (t) => ({ margin: `0 ${t.space.$4}` })
			}),
			/* @__PURE__ */ jsx(DividerLine, {})
		]
	});
};
const VerticalDivider = (props) => {
	const { sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		center: true,
		direction: "col",
		elementDescriptor: descriptors.dividerColumn,
		sx: [(t) => ({ height: t.space.$6 }), sx],
		...rest,
		children: /* @__PURE__ */ jsx(DividerLine, { vertical: true })
	});
};
const DividerLine = (props) => {
	const styles = props?.vertical ? { width: "1px" } : { height: "1px" };
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.dividerLine,
		sx: (t) => ({
			flex: "1",
			backgroundColor: t.colors.$borderAlpha100,
			...styles
		})
	});
};

//#endregion
export { Divider, VerticalDivider };
//# sourceMappingURL=Divider.js.map