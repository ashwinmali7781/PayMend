import SvgArrowRight from "../../icons/arrow-right.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Button, Col, Flex, Spinner } from "../../customizables/index.js";
import { OrganizationPreview } from "../../elements/OrganizationPreview.js";
import { PreviewButton } from "../../elements/PreviewButton.js";
import { forwardRef } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/common/organizations/OrganizationPreview.tsx
const OrganizationPreviewListItems = ({ elementDescriptor, children }) => {
	return /* @__PURE__ */ jsx(Col, {
		elementDescriptor,
		sx: (t) => ({
			maxHeight: `calc(8 * ${t.sizes.$12})`,
			overflowY: "auto",
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100,
			...common.unstyledScrollbar(t)
		}),
		children
	});
};
const sharedStyles = (t) => ({ padding: `${t.space.$4} ${t.space.$5}` });
const sharedMainIdentifierSx = (t) => ({
	color: t.colors.$colorForeground,
	":hover": { color: t.colors.$colorForeground }
});
const OrganizationPreviewListItem = ({ children, elementId, elementDescriptor, organizationData }) => {
	return /* @__PURE__ */ jsxs(Flex, {
		align: "center",
		gap: 2,
		sx: [(t) => ({
			minHeight: "unset",
			justifyContent: "space-between",
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100
		}), sharedStyles],
		elementDescriptor,
		children: [/* @__PURE__ */ jsx(OrganizationPreview, {
			elementId,
			mainIdentifierSx: sharedMainIdentifierSx,
			organization: organizationData
		}), children]
	});
};
const OrganizationPreviewSpinner = forwardRef((_, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		ref,
		sx: (t) => ({
			width: "100%",
			height: t.space.$12,
			position: "relative"
		}),
		children: /* @__PURE__ */ jsx(Box, {
			sx: {
				margin: "auto",
				position: "absolute",
				left: "50%",
				top: "50%",
				transform: "translateY(-50%) translateX(-50%)"
			},
			children: /* @__PURE__ */ jsx(Spinner, {
				size: "sm",
				colorScheme: "primary",
				elementDescriptor: descriptors.spinner
			})
		})
	});
});
const OrganizationPreviewListItemButton = (props) => {
	return /* @__PURE__ */ jsx(Button, {
		textVariant: "buttonSmall",
		variant: "outline",
		size: "xs",
		...props
	});
};
const OrganizationPreviewButton = (props) => {
	return /* @__PURE__ */ jsx(PreviewButton, {
		sx: [sharedStyles],
		icon: SvgArrowRight,
		...props
	});
};

//#endregion
export { OrganizationPreviewButton, OrganizationPreviewListItem, OrganizationPreviewListItemButton, OrganizationPreviewListItems, OrganizationPreviewSpinner, sharedMainIdentifierSx };
//# sourceMappingURL=OrganizationPreview.js.map