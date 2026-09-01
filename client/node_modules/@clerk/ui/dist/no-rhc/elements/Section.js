import SvgPlus from "../icons/plus.js";
import { mqu } from "../styledSystem/breakpoints.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Button, Col, Flex, Icon, Spinner, Text } from "../customizables/index.js";
import { Animated } from "./Animated.js";
import { Menu, MenuItem, MenuList, MenuTrigger } from "./Menu.js";
import { ArrowBlockButton } from "./ArrowBlockButton.js";
import { forwardRef, isValidElement, useLayoutEffect, useRef, useState } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Section.tsx
const ProfileSectionRoot = (props) => {
	const { title, titleId, centered = true, children, id, sx, badge, ...rest } = props;
	const ref = useRef(null);
	const [height, setHeight] = useState(0);
	useLayoutEffect(() => {
		const element = ref.current;
		if (element) setHeight(element.clientHeight + element.clientTop || 0);
	}, []);
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.profileSection,
		elementId: descriptors.profileSection.setId(id),
		sx: [(t) => ({
			flexDirection: "row-reverse",
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100,
			paddingTop: t.space.$4,
			paddingBottom: t.space.$4,
			gap: t.space.$6,
			[mqu.lg]: {
				flexDirection: "column-reverse",
				gap: t.space.$2
			}
		}), sx],
		...rest,
		children: [/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.profileSectionContent,
			elementId: descriptors.profileSectionContent.setId(id),
			gap: 2,
			ref,
			sx: {
				minWidth: 0,
				width: "100%",
				"+ *": { "--clerk-height": `${height}px` }
			},
			children
		}), /* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.profileSectionHeader,
			elementId: descriptors.profileSectionHeader.setId(id),
			sx: (t) => ({
				padding: centered ? void 0 : `${t.space.$1x5} 0`,
				gap: t.space.$1,
				width: t.space.$66,
				alignSelf: height ? "self-start" : centered ? "center" : void 0,
				marginTop: centered ? "calc(var(--clerk-height)/2)" : void 0,
				transform: height && centered ? "translateY(-50%)" : void 0,
				[mqu.lg]: {
					alignSelf: "self-start",
					marginTop: "unset",
					transform: "none",
					padding: 0
				}
			}),
			children: /* @__PURE__ */ jsx(SectionHeader, {
				localizationKey: title,
				textId: titleId,
				elementDescriptor: descriptors.profileSectionTitle,
				elementId: descriptors.profileSectionTitle.setId(id),
				textElementDescriptor: descriptors.profileSectionTitleText,
				textElementId: descriptors.profileSectionTitleText.setId(id),
				sx: badge ? (t) => ({
					alignItems: "center",
					gap: t.space.$2
				}) : void 0,
				children: badge
			})
		})]
	});
};
const ProfileSectionItemList = (props) => {
	const { children, id, disableAnimation = false, ...rest } = props;
	const componentBody = /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.profileSectionItemList,
		elementId: descriptors.profileSectionItemList.setId(id),
		sx: (t) => ({ gap: t.space.$0x5 }),
		...rest,
		children
	});
	if (disableAnimation) return componentBody;
	return /* @__PURE__ */ jsx(Animated, {
		asChild: true,
		children: componentBody
	});
};
const ProfileSectionItem = (props) => {
	const { children, id, sx, hoverable, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.profileSectionItem,
		elementId: descriptors.profileSectionItem.setId(id),
		sx: [(t) => ({
			justifyContent: "space-between",
			width: "100%",
			alignItems: "center",
			padding: `${t.space.$1} ${t.space.$1} ${t.space.$1} ${t.space.$2x5}`,
			gap: t.space.$2,
			...hoverable && {
				borderRadius: t.radii.$lg,
				":hover": { backgroundColor: t.colors.$neutralAlpha50 }
			}
		}), sx],
		...rest,
		children
	});
};
const ProfileSectionButton = (props) => {
	const { children, id, sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.profileSectionPrimaryButton,
		elementId: descriptors.profileSectionPrimaryButton.setId(id),
		variant: "ghost",
		sx: [(t) => ({
			whiteSpace: "nowrap",
			justifyContent: "start",
			gap: t.space.$2,
			padding: `${t.space.$1x5} ${t.space.$3} ${t.space.$1x5} ${t.space.$2x5}`
		}), sx],
		...rest,
		children
	});
};
const ProfileSectionArrowButton = forwardRef((props, ref) => {
	const { children, leftIcon = SvgPlus, id, sx, localizationKey, ...rest } = props;
	return /* @__PURE__ */ jsx(ArrowBlockButton, {
		elementDescriptor: descriptors.profileSectionPrimaryButton,
		elementId: descriptors.profileSectionPrimaryButton.setId(id),
		variant: "ghost",
		sx: [(t) => ({
			textWrap: "nowrap",
			justifyContent: "start",
			height: t.sizes.$8
		}), sx],
		textLocalizationKey: localizationKey,
		leftIcon,
		leftIconSx: (t) => ({
			width: t.sizes.$4,
			height: t.sizes.$4
		}),
		ref,
		...rest,
		children
	});
});
const ProfileSectionButtonGroup = (props) => {
	const { children, id, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.profileSectionButtonGroup,
		elementId: descriptors.profileSectionButtonGroup.setId(id),
		justify: "between",
		gap: 2,
		...rest,
		children
	});
};
const ProfileSectionActionMenuItem = (props) => {
	const { children, isLoading, localizationKey, sx, leftIcon, leftIconSx, ...rest } = props;
	const isIconElement = isValidElement(leftIcon);
	return /* @__PURE__ */ jsxs(MenuItem, {
		sx: [(theme) => ({ padding: `${theme.space.$1x5} ${theme.space.$2}` }), sx],
		isLoading,
		...rest,
		children: [(isLoading || leftIcon) && /* @__PURE__ */ jsx(Flex, {
			as: "span",
			sx: (theme) => ({ flex: `0 0 ${theme.space.$4}` }),
			children: isLoading ? /* @__PURE__ */ jsx(Spinner, {
				elementDescriptor: descriptors.spinner,
				size: "sm"
			}) : !isIconElement && leftIcon ? /* @__PURE__ */ jsx(Icon, {
				icon: leftIcon,
				sx: [(theme) => ({
					color: theme.colors.$neutralAlpha600,
					width: theme.sizes.$5
				}), leftIconSx]
			}) : leftIcon
		}), /* @__PURE__ */ jsx(Text, { localizationKey })]
	});
};
const ProfileSectionActionMenu = (props) => {
	const { children, triggerLocalizationKey, id, triggerSx, onClick } = props;
	return /* @__PURE__ */ jsx(Flex, {
		sx: { position: "relative" },
		children: /* @__PURE__ */ jsxs(Menu, {
			elementId: id,
			children: [/* @__PURE__ */ jsx(MenuTrigger, { children: /* @__PURE__ */ jsx(ProfileSectionArrowButton, {
				id,
				textLocalizationKey: triggerLocalizationKey,
				sx: [(t) => ({
					justifyContent: "start",
					height: t.sizes.$8
				}), triggerSx],
				leftIcon: SvgPlus,
				leftIconSx: (t) => ({
					width: t.sizes.$4,
					height: t.sizes.$4
				}),
				onClick
			}) }), /* @__PURE__ */ jsx(MenuList, {
				asPortal: false,
				sx: (t) => ({
					width: "100%",
					padding: t.space.$1
				}),
				children
			})]
		})
	});
};
const ProfileSection = {
	Root: ProfileSectionRoot,
	ItemList: ProfileSectionItemList,
	Item: ProfileSectionItem,
	Button: ProfileSectionButton,
	ArrowButton: ProfileSectionArrowButton,
	ButtonGroup: ProfileSectionButtonGroup,
	ActionMenu: ProfileSectionActionMenu,
	ActionMenuItem: ProfileSectionActionMenuItem
};
const SectionHeader = (props) => {
	const { textElementDescriptor, textElementId, textId, localizationKey, children, ...rest } = props;
	return /* @__PURE__ */ jsxs(Flex, {
		...rest,
		children: [/* @__PURE__ */ jsx(Text, {
			id: textId,
			localizationKey,
			variant: "subtitle",
			elementDescriptor: textElementDescriptor,
			elementId: textElementId
		}), children]
	});
};

//#endregion
export { ProfileSection };
//# sourceMappingURL=Section.js.map