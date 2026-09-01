import SvgInformationCircle from "../icons/information-circle.js";
import { Flex, Icon, Text } from "../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/InformationBox.tsx
function InformationBox(props) {
	return /* @__PURE__ */ jsxs(Flex, {
		sx: (t) => ({
			gap: t.space.$2,
			padding: `${t.space.$3} ${t.space.$4}`,
			backgroundColor: t.colors.$neutralAlpha50,
			borderRadius: t.radii.$md
		}),
		children: [/* @__PURE__ */ jsx(Icon, {
			icon: SvgInformationCircle,
			sx: (t) => ({ opacity: t.opacity.$disabled })
		}), /* @__PURE__ */ jsx(Text, {
			localizationKey: props.message,
			sx: (t) => ({ color: t.colors.$colorMutedForeground })
		})]
	});
}

//#endregion
export { InformationBox };
//# sourceMappingURL=InformationBox.js.map