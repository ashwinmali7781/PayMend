import { useClipboard } from "../hooks/useClipboard.js";
import SvgCheckmark from "../icons/checkmark.js";
import SvgCopy from "../icons/copy.js";
import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Box, Button, Dd, Dl, Dt, Icon, Span } from "../customizables/index.js";
import { truncateWithEndVisible } from "../utils/truncateTextWithEndVisible.js";
import * as React$1 from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/LineItems.tsx
function Root({ children }) {
	return /* @__PURE__ */ jsx(Dl, {
		elementDescriptor: descriptors.lineItemsRoot,
		sx: (t) => ({
			display: "grid",
			gridRowGap: t.space.$2
		}),
		children
	});
}
const GroupContext = React$1.createContext(void 0);
function Group({ children, borderTop = false, variant = "primary" }) {
	return /* @__PURE__ */ jsx(GroupContext.Provider, {
		value: { variant },
		children: /* @__PURE__ */ jsx(Box, {
			elementDescriptor: descriptors.lineItemsGroup,
			elementId: descriptors.lineItemsGroup.setId(variant),
			sx: (t) => ({
				display: "grid",
				gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
				...borderTop ? {
					borderTopWidth: t.borderWidths.$normal,
					borderTopStyle: t.borderStyles.$solid,
					borderTopColor: t.colors.$borderAlpha100,
					paddingTop: t.space.$2
				} : {}
			}),
			children
		})
	});
}
const Title = React$1.forwardRef(({ title, description, icon, badge = null }, ref) => {
	const context = React$1.useContext(GroupContext);
	if (!context) throw new Error("LineItems.Title must be used within LineItems.Group");
	const { variant } = context;
	const textVariant = variant === "primary" ? "subtitle" : "caption";
	const descriptionElements = description ? Array.isArray(description) ? description : [description] : [];
	return /* @__PURE__ */ jsxs(Dt, {
		ref,
		elementDescriptor: descriptors.lineItemsTitle,
		elementId: descriptors.lineItemsTitle.setId(variant),
		sx: (t) => ({
			display: "grid",
			color: variant === "primary" ? t.colors.$colorForeground : t.colors.$colorMutedForeground,
			...common.textVariants(t)[textVariant]
		}),
		children: [title || badge ? /* @__PURE__ */ jsxs(Span, {
			sx: (t) => ({
				display: "inline-flex",
				alignItems: "center",
				gap: t.space.$2
			}),
			children: [
				icon ? /* @__PURE__ */ jsx(Icon, {
					size: "md",
					icon,
					"aria-hidden": true
				}) : null,
				title ? /* @__PURE__ */ jsx(Span, { localizationKey: title }) : null,
				badge ? /* @__PURE__ */ jsx(Box, { children: badge }) : null
			]
		}) : null, descriptionElements.length > 0 ? /* @__PURE__ */ jsx(Fragment$1, { children: descriptionElements.map((el, i) => /* @__PURE__ */ jsx(Span, {
			localizationKey: el,
			elementDescriptor: descriptors.lineItemsTitleDescription,
			sx: (t) => ({
				fontSize: t.fontSizes.$sm,
				color: t.colors.$colorMutedForeground
			})
		}, i)) }) : null]
	});
});
function Description({ text, prefix, suffix, truncateText = false, copyText = false, copyLabel, descriptionInnerAlignment = "end" }) {
	const context = React$1.useContext(GroupContext);
	if (!context) throw new Error("LineItems.Description must be used within LineItems.Group");
	const { variant } = context;
	return /* @__PURE__ */ jsxs(Dd, {
		elementDescriptor: descriptors.lineItemsDescription,
		elementId: descriptors.lineItemsDescription.setId(variant),
		sx: (t) => ({
			display: "grid",
			justifyContent: "end",
			color: variant === "tertiary" ? t.colors.$colorMutedForeground : t.colors.$colorForeground
		}),
		children: [/* @__PURE__ */ jsxs(Span, {
			elementDescriptor: descriptors.lineItemsDescriptionInner,
			sx: (t) => ({
				display: "inline-flex",
				justifyContent: "flex-end",
				alignItems: descriptionInnerAlignment,
				gap: t.space.$1,
				minWidth: "0"
			}),
			children: [
				prefix ? /* @__PURE__ */ jsx(Span, {
					localizationKey: prefix,
					elementDescriptor: descriptors.lineItemsDescriptionPrefix,
					sx: (t) => ({
						color: t.colors.$colorMutedForeground,
						...common.textVariants(t).caption
					})
				}) : null,
				typeof text === "string" && truncateText ? /* @__PURE__ */ jsx(TruncatedText, { text }) : /* @__PURE__ */ jsx(Span, {
					localizationKey: text,
					elementDescriptor: descriptors.lineItemsDescriptionText,
					sx: (t) => ({
						...common.textVariants(t).body,
						minWidth: "0",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap"
					})
				}),
				typeof text === "string" && copyText ? /* @__PURE__ */ jsx(CopyButton, {
					text,
					copyLabel
				}) : null
			]
		}), suffix ? /* @__PURE__ */ jsx(Span, {
			localizationKey: suffix,
			elementDescriptor: descriptors.lineItemsDescriptionSuffix,
			sx: (t) => ({
				color: t.colors.$colorMutedForeground,
				...common.textVariants(t).caption,
				justifySelf: "flex-end"
			})
		}) : null]
	});
}
function TruncatedText({ text }) {
	const { onCopy } = useClipboard(text);
	return /* @__PURE__ */ jsx(Span, {
		elementDescriptor: descriptors.lineItemsDescriptionText,
		sx: (t) => ({
			...common.textVariants(t).body,
			display: "flex",
			minWidth: "0"
		}),
		onCopy: async (e) => {
			e.preventDefault();
			await onCopy();
		},
		children: truncateWithEndVisible(text, 15)
	});
}
function CopyButton({ text, copyLabel = "Copy" }) {
	const { onCopy, hasCopied } = useClipboard(text);
	return /* @__PURE__ */ jsx(Button, {
		variant: "unstyled",
		onClick: () => onCopy(),
		sx: (t) => ({
			color: "inherit",
			width: t.sizes.$4,
			height: t.sizes.$4,
			padding: 0,
			borderRadius: t.radii.$sm,
			"&:focus-visible": {
				outline: "2px solid",
				outlineColor: t.colors.$colorRing
			}
		}),
		focusRing: false,
		"aria-label": hasCopied ? "Copied" : copyLabel,
		children: /* @__PURE__ */ jsx(Icon, {
			size: "sm",
			icon: hasCopied ? SvgCheckmark : SvgCopy,
			"aria-hidden": true
		})
	});
}
const LineItems = {
	Root,
	Group,
	Title,
	Description
};

//#endregion
export { LineItems };
//# sourceMappingURL=LineItems.js.map