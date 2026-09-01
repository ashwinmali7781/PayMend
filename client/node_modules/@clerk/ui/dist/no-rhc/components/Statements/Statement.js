import { useClipboard } from "../../hooks/useClipboard.js";
import SvgCheckmark from "../../icons/checkmark.js";
import SvgCopy from "../../icons/copy.js";
import SvgFiles from "../../icons/files.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Badge, Box, Button, Heading, Icon, Span, Text } from "../../customizables/index.js";
import { truncateWithEndVisible } from "../../utils/truncateTextWithEndVisible.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Statements/Statement.tsx
function Root({ children }) {
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.statementRoot,
		as: "article",
		sx: (t) => ({
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha100,
			borderRadius: t.radii.$lg,
			overflow: "clip"
		}),
		children
	});
}
function Header({ title, id, status }) {
	return /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.statementHeader,
		as: "header",
		sx: (t) => ({
			padding: t.space.$4,
			background: t.colors.$neutralAlpha25,
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-start"
		}),
		children: [/* @__PURE__ */ jsxs(Span, {
			elementDescriptor: descriptors.statementHeaderTitleContainer,
			children: [/* @__PURE__ */ jsx(Heading, {
				elementDescriptor: descriptors.statementHeaderTitle,
				textVariant: "h2",
				localizationKey: title
			}), /* @__PURE__ */ jsxs(Span, {
				sx: (t) => ({
					display: "flex",
					alignItems: "center",
					gap: t.space.$0x25,
					color: t.colors.$colorMutedForeground
				}),
				children: [/* @__PURE__ */ jsx(CopyButton, {
					copyLabel: "Copy statement ID",
					text: id
				}), /* @__PURE__ */ jsx(Text, {
					colorScheme: "secondary",
					variant: "subtitle",
					children: truncateWithEndVisible(id)
				})]
			})]
		}), /* @__PURE__ */ jsx(Badge, {
			elementDescriptor: descriptors.statementHeaderBadge,
			colorScheme: status === "open" ? "secondary" : "primary",
			sx: { textTransform: "capitalize" },
			children: status
		})]
	});
}
function Body({ children }) {
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.statementBody,
		children
	});
}
function Section({ children }) {
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.statementSection,
		as: "section",
		children
	});
}
function SectionHeader({ text }) {
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.statementSectionHeader,
		sx: (t) => ({
			paddingInline: t.space.$4,
			paddingBlock: t.space.$1,
			background: t.colors.$neutralAlpha50,
			borderBlockWidth: t.borderWidths.$normal,
			borderBlockStyle: t.borderStyles.$solid,
			borderBlockColor: t.colors.$borderAlpha100
		}),
		children: /* @__PURE__ */ jsx(Heading, {
			elementDescriptor: descriptors.statementSectionHeaderTitle,
			textVariant: "h3",
			as: "h2",
			localizationKey: text,
			sx: (t) => ({ fontWeight: t.fontWeights.$medium })
		})
	});
}
function SectionContent({ children }) {
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.statementSectionContent,
		children
	});
}
function SectionContentItem({ children }) {
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.statementSectionContentItem,
		sx: (t) => ({
			paddingInline: t.space.$4,
			paddingBlock: t.space.$3,
			"&:not(:first-child)": {
				borderBlockStartWidth: t.borderWidths.$normal,
				borderBlockStartStyle: t.borderStyles.$solid,
				borderBlockStartColor: t.colors.$borderAlpha100
			}
		}),
		children
	});
}
function SectionContentDetailsHeader({ title, description, secondaryTitle, secondaryDescription }) {
	return /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.statementSectionContentDetailsHeader,
		sx: (t) => ({
			marginBlockEnd: t.space.$2,
			display: "flex",
			justifyContent: "space-between"
		}),
		children: [/* @__PURE__ */ jsxs(Box, {
			elementDescriptor: descriptors.statementSectionContentDetailsHeaderItem,
			children: [/* @__PURE__ */ jsxs(Span, {
				sx: (t) => ({
					display: "flex",
					alignItems: "center",
					gap: t.space.$1
				}),
				children: [/* @__PURE__ */ jsx(Icon, {
					elementDescriptor: descriptors.statementSectionContentDetailsHeaderItemIcon,
					icon: SvgFiles,
					colorScheme: "neutral"
				}), /* @__PURE__ */ jsx(Heading, {
					elementDescriptor: descriptors.statementSectionContentDetailsHeaderTitle,
					as: "h3",
					textVariant: "h3",
					localizationKey: title
				})]
			}), /* @__PURE__ */ jsx(Text, {
				variant: "caption",
				colorScheme: "secondary",
				elementDescriptor: descriptors.statementSectionContentDetailsHeaderDescription,
				localizationKey: description,
				sx: { textTransform: "lowercase" }
			})]
		}), /* @__PURE__ */ jsxs(Box, {
			elementDescriptor: descriptors.statementSectionContentDetailsHeaderItem,
			sx: { textAlign: "end" },
			children: [secondaryTitle && /* @__PURE__ */ jsx(Text, {
				variant: "h3",
				elementDescriptor: descriptors.statementSectionContentDetailsHeaderSecondaryTitle,
				localizationKey: secondaryTitle
			}), secondaryDescription && /* @__PURE__ */ jsx(Text, {
				variant: "caption",
				colorScheme: "secondary",
				elementDescriptor: descriptors.statementSectionContentDetailsHeaderSecondaryDescription,
				localizationKey: secondaryDescription
			})]
		})]
	});
}
function SectionContentDetailsList({ children }) {
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.statementSectionContentDetailsList,
		as: "ul",
		sx: (t) => ({
			margin: 0,
			padding: 0,
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha100,
			borderRadius: t.radii.$md,
			overflow: "hidden"
		}),
		children
	});
}
function SectionContentDetailsListItem({ labelIcon, label, valueCopyable = false, value, valueTruncated = false }) {
	return /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.statementSectionContentDetailsListItem,
		as: "li",
		sx: (t) => ({
			margin: 0,
			paddingInline: t.space.$2,
			paddingBlock: t.space.$1x5,
			display: "flex",
			justifyContent: "space-between",
			flexWrap: "wrap",
			columnGap: t.space.$2,
			rowGap: t.space.$0x5,
			"&:not(:first-child)": {
				borderBlockStartWidth: t.borderWidths.$normal,
				borderBlockStartStyle: t.borderStyles.$solid,
				borderBlockStartColor: t.colors.$borderAlpha100
			}
		}),
		children: [/* @__PURE__ */ jsxs(Span, {
			elementDescriptor: descriptors.statementSectionContentDetailsListItemLabelContainer,
			sx: (t) => ({
				display: "flex",
				alignItems: "center",
				gap: t.space.$1x5
			}),
			children: [labelIcon ? /* @__PURE__ */ jsx(Icon, {
				icon: labelIcon,
				colorScheme: "neutral"
			}) : null, /* @__PURE__ */ jsx(Text, {
				variant: "caption",
				colorScheme: "secondary",
				elementDescriptor: descriptors.statementSectionContentDetailsListItemLabel,
				localizationKey: label
			})]
		}), /* @__PURE__ */ jsx(Span, {
			sx: (t) => ({
				display: "flex",
				alignItems: "center",
				gap: t.space.$0x25,
				color: t.colors.$colorMutedForeground
			}),
			children: typeof value === "string" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [valueCopyable ? /* @__PURE__ */ jsx(CopyButton, {
				copyLabel: "Copy statement ID",
				text: value
			}) : null, /* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				variant: "caption",
				elementDescriptor: descriptors.statementSectionContentDetailsListItemValue,
				children: valueTruncated ? truncateWithEndVisible(value) : value
			})] }) : React.isValidElement(value) ? value : /* @__PURE__ */ jsx(Text, {
				elementDescriptor: descriptors.statementSectionContentDetailsListItemValue,
				colorScheme: "secondary",
				variant: "caption",
				localizationKey: value
			})
		})]
	});
}
function Footer({ label, value }) {
	return /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.statementFooter,
		as: "footer",
		sx: (t) => ({
			paddingInline: t.space.$4,
			paddingBlock: t.space.$3,
			background: t.colors.$neutralAlpha25,
			borderBlockStartWidth: t.borderWidths.$normal,
			borderBlockStartStyle: t.borderStyles.$solid,
			borderBlockStartColor: t.colors.$borderAlpha100,
			display: "flex",
			justifyContent: "space-between"
		}),
		children: [/* @__PURE__ */ jsx(Text, {
			variant: "h3",
			localizationKey: label,
			elementDescriptor: descriptors.statementFooterLabel
		}), /* @__PURE__ */ jsxs(Span, {
			elementDescriptor: descriptors.statementFooterValueContainer,
			sx: (t) => ({
				display: "flex",
				alignItems: "center",
				gap: t.space.$2x5
			}),
			children: [/* @__PURE__ */ jsx(Text, {
				variant: "caption",
				colorScheme: "secondary",
				elementDescriptor: descriptors.statementFooterCurrency,
				children: "USD"
			}), /* @__PURE__ */ jsx(Text, {
				variant: "h3",
				elementDescriptor: descriptors.statementFooterValue,
				children: value
			})]
		})]
	});
}
function CopyButton({ text, copyLabel = "Copy" }) {
	const { onCopy, hasCopied } = useClipboard(text);
	return /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.statementCopyButton,
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
const Statement = {
	Root,
	Header,
	Body,
	Section,
	SectionHeader,
	SectionContent,
	SectionContentItem,
	SectionContentDetailsHeader,
	SectionContentDetailsList,
	SectionContentDetailsListItem,
	Footer
};

//#endregion
export { Statement };
//# sourceMappingURL=Statement.js.map