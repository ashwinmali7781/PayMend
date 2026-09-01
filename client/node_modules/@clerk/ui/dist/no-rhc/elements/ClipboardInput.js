import { useClipboard } from "../hooks/useClipboard.js";
import SvgClipboard from "../icons/clipboard.js";
import SvgShieldCheck from "../icons/shield-check.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Button, Flex, Icon, Input } from "../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/ClipboardInput.tsx
const ClipboardInput = (props) => {
	const { id, value, copyIcon = SvgClipboard, copiedIcon = SvgShieldCheck, sx, ...rest } = props;
	const { onCopy, hasCopied } = useClipboard(value);
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		justify: "center",
		sx: [{ position: "relative" }, sx],
		children: [/* @__PURE__ */ jsx(Input, {
			...rest,
			value,
			readOnly: true,
			sx: (theme) => ({
				paddingInlineEnd: theme.space.$7x5,
				textOverflow: "ellipsis"
			})
		}), /* @__PURE__ */ jsx(Button, {
			elementDescriptor: descriptors.formFieldInputCopyToClipboardButton,
			variant: "ghost",
			onClick: () => onCopy(),
			sx: (t) => {
				return {
					position: "absolute",
					insetInlineEnd: t.space.$1,
					padding: 0,
					height: t.sizes.$6,
					aspectRatio: 1,
					borderRadius: `calc(${t.radii.$md} - ${t.space.$1})`
				};
			},
			children: /* @__PURE__ */ jsx(Icon, {
				elementDescriptor: descriptors.formFieldInputCopyToClipboardIcon,
				icon: hasCopied ? copiedIcon : copyIcon
			})
		})]
	});
};

//#endregion
export { ClipboardInput };
//# sourceMappingURL=ClipboardInput.js.map