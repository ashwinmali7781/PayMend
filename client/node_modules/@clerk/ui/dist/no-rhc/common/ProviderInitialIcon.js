import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Box, Text } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/common/ProviderInitialIcon.tsx
const ProviderInitialIcon = (props) => {
	const { value, id, ...rest } = props;
	return /* @__PURE__ */ jsx(Box, {
		as: "span",
		elementDescriptor: [descriptors.providerIcon, descriptors.socialButtonsProviderInitialIcon],
		elementId: descriptors.socialButtonsProviderInitialIcon.setId(id),
		sx: (t) => ({
			...common.centeredFlex("inline-flex"),
			width: t.space.$4,
			height: t.space.$4,
			borderRadius: t.radii.$sm,
			color: t.colors.$colorPrimaryForeground,
			backgroundColor: t.colors.$primary500
		}),
		...rest,
		children: /* @__PURE__ */ jsx(Text, {
			as: "span",
			variant: "buttonSmall",
			sx: {
				...common.centeredFlex("inline-flex"),
				width: "100%"
			},
			children: value[0].toUpperCase()
		})
	});
};

//#endregion
export { ProviderInitialIcon };
//# sourceMappingURL=ProviderInitialIcon.js.map