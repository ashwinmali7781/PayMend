import SvgCheckmark from "../../icons/checkmark.js";
import { common } from "../../styledSystem/common.js";
import { Box, Icon, Image, Text } from "../../customizables/index.js";
import { Select, SelectButton, SelectOptionList } from "../../elements/Select.js";
import { useRef } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OAuthConsent/OrgSelect.tsx
function OrgSelect({ options, value, onChange }) {
	const buttonRef = useRef(null);
	const selected = options.find((option) => option.value === value);
	return /* @__PURE__ */ jsxs(Select, {
		options,
		value,
		onChange: (option) => onChange(option.value),
		referenceElement: buttonRef,
		renderOption: (option, _index, isSelected) => /* @__PURE__ */ jsxs(Box, {
			as: "span",
			sx: (theme) => ({
				width: "100%",
				display: "grid",
				gridTemplateColumns: `${theme.sizes.$5} 1fr ${theme.sizes.$3}`,
				columnGap: theme.space.$2,
				paddingInlineStart: theme.space.$1,
				paddingInlineEnd: theme.space.$1x5,
				paddingBlock: theme.space.$1,
				alignItems: "center",
				borderRadius: theme.radii.$md,
				"&:hover, &[data-focused=\"true\"]": { background: common.mutedBackground(theme) }
			}),
			children: [
				/* @__PURE__ */ jsx(Image, {
					src: option.logoUrl,
					alt: option.label,
					sx: (theme) => ({
						width: theme.sizes.$5,
						height: theme.sizes.$5,
						objectFit: "contain",
						flexShrink: 0,
						borderRadius: theme.radii.$md
					})
				}),
				/* @__PURE__ */ jsx(Text, {
					sx: {
						flex: 1,
						textAlign: "start",
						minWidth: 0,
						maxInlineSize: "200px"
					},
					truncate: true,
					as: "span",
					variant: "subtitle",
					children: option.label
				}),
				isSelected && /* @__PURE__ */ jsx(Icon, {
					icon: SvgCheckmark,
					sx: (theme) => ({ color: theme.colors.$primary500 })
				})
			]
		}),
		children: [/* @__PURE__ */ jsxs(SelectButton, {
			ref: buttonRef,
			"aria-haspopup": "listbox",
			sx: (theme) => ({ paddingInline: theme.space.$3 }),
			children: [/* @__PURE__ */ jsx(Image, {
				src: selected?.logoUrl || "",
				alt: selected?.label || "",
				sx: (theme) => ({
					width: theme.sizes.$5,
					height: theme.sizes.$5,
					borderRadius: theme.radii.$md,
					objectFit: "contain",
					flexShrink: 0
				})
			}), /* @__PURE__ */ jsx(Text, {
				colorScheme: "body",
				as: "span",
				truncate: true,
				sx: {
					flex: 1,
					minWidth: 0,
					textAlign: "start"
				},
				children: selected?.label || "Select an option"
			})]
		}), /* @__PURE__ */ jsx(SelectOptionList, {})]
	});
}

//#endregion
export { OrgSelect };
//# sourceMappingURL=OrgSelect.js.map