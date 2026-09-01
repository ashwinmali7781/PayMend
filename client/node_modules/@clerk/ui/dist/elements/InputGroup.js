import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Input, Text } from "../customizables/index.js";
import { forwardRef } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/InputGroup.tsx
const InputGroup = forwardRef((props, ref) => {
	const { sx, groupPrefix, groupSuffix, ...rest } = props;
	const inputBorder = groupPrefix ? {
		borderStartStartRadius: "0",
		borderEndStartRadius: "0"
	} : {
		borderStartEndRadius: "0",
		borderEndEndRadius: "0"
	};
	const textProps = (t) => ({
		paddingInline: t.space.$2,
		borderStartEndRadius: "0",
		borderEndEndRadius: "0",
		width: "fit-content",
		display: "flex",
		alignItems: "center"
	});
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.formInputGroup,
		direction: "row",
		hasError: rest.hasError,
		sx: (theme) => ({
			position: "relative",
			zIndex: 1,
			...common.borderVariants(theme).normal,
			"&:has(:focus-visible),&:focus-within": { ...common.borderVariants(theme, { focusRing: true }).normal["&:focus-visible"] }
		}),
		children: [
			groupPrefix && /* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				sx: textProps,
				children: groupPrefix
			}),
			/* @__PURE__ */ jsx(Input, {
				maxLength: 25,
				sx: [{ ...inputBorder }, sx],
				variant: "unstyled",
				ref,
				...rest
			}),
			groupSuffix && /* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				sx: textProps,
				children: groupSuffix
			})
		]
	});
});

//#endregion
export { InputGroup };
//# sourceMappingURL=InputGroup.js.map