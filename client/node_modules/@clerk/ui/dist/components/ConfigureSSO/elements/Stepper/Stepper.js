import SvgCheckmark from "../../../../icons/checkmark.js";
import SvgChevronRight from "../../../../icons/chevron-right.js";
import { mqu } from "../../../../styledSystem/breakpoints.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { Box, Flex, Icon, SimpleButton, Span, Text } from "../../../../customizables/index.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/elements/Stepper/Stepper.tsx
const Root = ({ children }) => {
	const items = React.Children.toArray(children).filter((child) => React.isValidElement(child));
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.configureSSOStepper,
		align: "center",
		sx: (theme) => ({
			gap: theme.space.$2,
			flexWrap: "wrap",
			[mqu.md]: { gap: theme.space.$3 }
		}),
		children: items.map((child, index) => /* @__PURE__ */ jsxs(Span, {
			sx: (theme) => ({
				display: "flex",
				alignItems: "center",
				gap: theme.space.$2
			}),
			children: [child, index < items.length - 1 && /* @__PURE__ */ jsx(Icon, {
				elementDescriptor: descriptors.configureSSOStepperSeparator,
				icon: SvgChevronRight,
				size: "md",
				colorScheme: "neutral",
				sx: { [mqu.md]: { display: "none" } }
			})]
		}, index))
	});
};
const Item = ({ bullet, isCurrent, isCompleted, isReachable = true, onClick, children }) => {
	return /* @__PURE__ */ jsxs(SimpleButton, {
		elementDescriptor: descriptors.configureSSOStepperItem,
		isActive: isCurrent,
		variant: "unstyled",
		isDisabled: !isReachable,
		onClick,
		sx: (theme) => ({
			gap: theme.space.$1x5,
			padding: 0,
			color: isCurrent || isCompleted ? theme.colors.$colorForeground : theme.colors.$colorMutedForeground,
			"&:disabled,&[data-disabled]": { opacity: 1 }
		}),
		children: [/* @__PURE__ */ jsx(Flex, {
			elementDescriptor: descriptors.configureSSOStepperItemBullet,
			isActive: isCurrent,
			align: "center",
			justify: "center",
			sx: (theme) => ({
				width: theme.sizes.$4,
				height: theme.sizes.$4,
				borderRadius: theme.radii.$circle,
				backgroundColor: isCompleted ? theme.colors.$success500 : isCurrent ? theme.colors.$colorForeground : theme.colors.$colorMutedForeground
			}),
			children: isCompleted ? /* @__PURE__ */ jsx(Icon, {
				icon: SvgCheckmark,
				size: "sm",
				sx: (theme) => ({ color: theme.colors.$white })
			}) : /* @__PURE__ */ jsx(Text, {
				as: "span",
				sx: (theme) => ({
					fontSize: theme.fontSizes.$xs,
					fontWeight: theme.fontWeights.$medium,
					color: theme.colors.$colorBackground,
					lineHeight: "1rem"
				}),
				children: bullet
			})
		}), /* @__PURE__ */ jsx(Text, {
			elementDescriptor: descriptors.configureSSOStepperItemLabel,
			as: "span",
			variant: "body",
			sx: {
				fontWeight: "inherit",
				color: "inherit"
			},
			children
		})]
	});
};
Item.displayName = "Stepper.Item";
const Skeleton = ({ totalSteps = 4 }) => /* @__PURE__ */ jsx(Flex, {
	elementDescriptor: descriptors.configureSSOStepper,
	align: "center",
	sx: (theme) => ({
		gap: theme.space.$2,
		flexWrap: "wrap",
		[mqu.md]: { gap: theme.space.$3 }
	}),
	children: Array.from({ length: totalSteps }).map((_, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsx(ItemSkeleton, {}), index < totalSteps - 1 && /* @__PURE__ */ jsx(Icon, {
		elementDescriptor: descriptors.configureSSOStepperSeparator,
		icon: SvgChevronRight,
		size: "md",
		colorScheme: "neutral",
		sx: {
			opacity: .16,
			[mqu.md]: { display: "none" }
		}
	})] }, index))
});
const ItemSkeleton = () => /* @__PURE__ */ jsxs(Flex, {
	align: "center",
	sx: (t) => ({
		gap: t.space.$1x5,
		minHeight: t.sizes.$4x5,
		opacity: .16
	}),
	children: [/* @__PURE__ */ jsx(Box, { sx: (t) => ({
		width: t.sizes.$4,
		height: t.sizes.$4,
		borderRadius: t.radii.$circle,
		backgroundColor: t.colors.$colorMutedForeground
	}) }), /* @__PURE__ */ jsx(Box, { sx: (t) => ({
		width: t.sizes.$17,
		height: t.sizes.$1x5,
		borderRadius: t.radii.$md,
		backgroundColor: t.colors.$colorMutedForeground
	}) })]
});
/**
* Numbered step indicator — purely presentational.
*
* Each `<Stepper.Item>` is a self-rendering component that takes
* `label`, `bullet`, `isCurrent`, `isCompleted`, `isReachable`, and
* `onClick`. The Stepper container only handles layout (gap +
* inserts a chevron separator between items). It does NOT walk
* children to extract descriptors, NOT compute reachability, NOT
* track current state — all of that is the host's responsibility.
*
* For the wizard surface, see `ConfigureSSOHeader` which maps
* `useWizard()` state into Stepper.Item props.
*/
const Stepper = Object.assign(Root, {
	Item,
	Skeleton
});

//#endregion
export { Stepper };
//# sourceMappingURL=Stepper.js.map