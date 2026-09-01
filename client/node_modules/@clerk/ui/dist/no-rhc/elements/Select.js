import { usePopover } from "../hooks/usePopover.js";
import { useSearchInput } from "../hooks/useSearchInput.js";
import SvgChevronDown from "../icons/chevron-down.js";
import { colors } from "../utils/colors/index.js";
import { common } from "../styledSystem/common.js";
import { animations } from "../styledSystem/animations.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { withFloatingTree } from "./contexts/index.js";
import { Button, Flex, Icon, Input, Text } from "../customizables/index.js";
import { Popover } from "./Popover.js";
import React from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { FloatingList, useInteractions, useListItem, useListNavigation } from "@floating-ui/react";

//#region src/elements/Select.tsx
const [SelectStateCtx, useSelectState] = createContextAndHook("SelectState");
const defaultRenderOption = (option, _index) => {
	return /* @__PURE__ */ jsx(Flex, {
		sx: (theme) => ({
			position: "relative",
			width: "100%",
			padding: `${theme.space.$2} ${theme.space.$4}`,
			margin: `0 ${theme.space.$1}`,
			borderRadius: theme.radii.$md,
			"&:hover, &[data-focused=\"true\"]": { background: common.mutedBackground(theme) },
			"&::before": {
				content: "\"\"",
				position: "absolute",
				inset: `calc(${theme.space.$0x5} * -1) calc(${theme.space.$1} * -1)`
			}
		}),
		children: /* @__PURE__ */ jsx(Text, {
			truncate: true,
			children: option.label || option.value
		})
	});
};
const defaultButtonRenderOption = (option) => {
	return option.label || option.value;
};
const Select = withFloatingTree((props) => {
	const { value, options, onChange, renderOption, noResultsMessage, comparator, placeholder = "Select an option", searchPlaceholder, elementId, children, portal = false, referenceElement = null, ...rest } = props;
	const popoverCtx = usePopover({
		autoUpdate: true,
		adjustToReferenceWidth: 2,
		referenceElement,
		offset: {
			mainAxis: 6,
			crossAxis: -1
		}
	});
	const togglePopover = popoverCtx.toggle;
	const { context } = popoverCtx;
	const elementsRef = React.useRef([]);
	const [activeIndex, setActiveIndex] = React.useState(null);
	const selectedIndex = options.findIndex((o) => o.value === value);
	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([useListNavigation(context, {
		listRef: elementsRef,
		activeIndex,
		selectedIndex: selectedIndex === -1 ? null : selectedIndex,
		onNavigate: setActiveIndex,
		loop: true,
		virtual: true
	})]);
	const generatedTriggerId = React.useId();
	const generatedListboxId = React.useId();
	const [triggerId, setTriggerId] = React.useState(generatedTriggerId);
	const [listboxId, setListboxId] = React.useState(generatedListboxId);
	const searchInputCtx = useSearchInput({
		items: options,
		comparator: comparator || (() => true)
	});
	const select = React.useCallback((option) => {
		onChange?.(option);
		togglePopover();
	}, [togglePopover, onChange]);
	const defaultChildren = /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(SelectOptionList, {}), /* @__PURE__ */ jsx(SelectButton, {})] });
	return /* @__PURE__ */ jsx(SelectStateCtx.Provider, {
		value: { value: {
			popoverCtx,
			searchInputCtx,
			selectedOption: options.find((o) => o.value === value) || null,
			noResultsMessage,
			value,
			renderOption: renderOption || defaultRenderOption,
			buttonRenderOption: renderOption || defaultButtonRenderOption,
			placeholder,
			searchPlaceholder,
			comparator,
			select,
			getReferenceProps,
			getFloatingProps,
			getItemProps,
			activeIndex,
			setActiveIndex,
			elementsRef,
			onTriggerClick: togglePopover,
			generatedTriggerId,
			triggerId,
			setTriggerId,
			generatedListboxId,
			listboxId,
			setListboxId,
			elementId,
			portal
		} },
		...rest,
		children: React.Children.count(children) ? children : defaultChildren
	});
});
const SelectRenderOption = React.memo((props) => {
	const { option, renderOption, isSelected, index, id, handleSelect, getItemProps, isFocused, elementId } = props;
	return /* @__PURE__ */ jsx(Flex, {
		ref: useListItem().ref,
		id,
		role: "option",
		"aria-selected": isSelected,
		sx: {
			userSelect: "none",
			cursor: "pointer"
		},
		...getItemProps({ onClick: () => handleSelect(option) }),
		children: React.cloneElement(renderOption(option, index, isSelected), {
			elementDescriptor: descriptors.selectOption,
			elementId: descriptors.selectOption.setId(elementId),
			"data-selected": isSelected,
			"data-focused": isFocused
		})
	});
});
const SelectSearchbar = (props) => {
	const { sx, ...rest } = props;
	React.useEffect(() => {
		return () => props.onChange({ target: { value: "" } });
	}, []);
	const { elementId } = useSelectState();
	return /* @__PURE__ */ jsx(Flex, {
		sx: (t) => ({ padding: t.space.$0x5 }),
		children: /* @__PURE__ */ jsx(Input, {
			elementDescriptor: descriptors.selectSearchInput,
			elementId: descriptors.selectSearchInput.setId(elementId),
			focusRing: false,
			variant: "unstyled",
			sx: [(t) => ({
				borderRadius: t.radii.$md,
				backgroundColor: t.colors.$neutralAlpha100,
				padding: t.space.$2
			}), sx],
			...rest
		})
	});
};
const SelectNoResults = (props) => {
	const { sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Text, {
		as: "div",
		sx: [(theme) => ({
			width: "100%",
			padding: `${theme.space.$1} ${theme.space.$2} ${theme.space.$2} ${theme.space.$2}`
		}), sx],
		...rest
	});
};
const SelectOptionList = (props) => {
	const { containerSx, sx, footer, onReachEnd, id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...rest } = props;
	const { popoverCtx, searchInputCtx, value, renderOption, searchPlaceholder, comparator, noResultsMessage, select, elementId, triggerId, generatedListboxId, setListboxId, portal, getFloatingProps, getItemProps, activeIndex, setActiveIndex, elementsRef } = useSelectState();
	const { filteredItems: options, searchInputProps } = searchInputCtx;
	const { isOpen, floating, styles, nodeId, context } = popoverCtx;
	const containerRef = React.useRef(null);
	const effectiveListboxId = id ?? generatedListboxId;
	const effectiveAriaLabelledBy = ariaLabelledBy ?? (ariaLabel ? void 0 : triggerId);
	const optionId = (index) => `${effectiveListboxId}-option-${index}`;
	React.useEffect(() => {
		setListboxId(effectiveListboxId);
	}, [effectiveListboxId, setListboxId]);
	React.useEffect(() => {
		if (isOpen) setActiveIndex(0);
	}, [options.length]);
	React.useEffect(() => {
		if (isOpen && !comparator) containerRef.current?.focus();
	}, [isOpen, comparator]);
	const onKeyDown = (e) => {
		if (e.key === "Enter" && activeIndex != null && activeIndex >= 0) {
			e.preventDefault();
			const option = options[activeIndex];
			if (option) select(option);
			return;
		}
		if (e.key === "ArrowDown" && onReachEnd && activeIndex === options.length - 1) onReachEnd();
	};
	const { "aria-activedescendant": rawActiveDescendant, ...floatingProps } = getFloatingProps(popoverCtx.getFloatingProps({ onKeyDown }));
	const activeDescendant = rawActiveDescendant;
	return /* @__PURE__ */ jsx(Popover, {
		nodeId,
		context,
		isOpen,
		portal: portal || false,
		order: ["content"],
		children: /* @__PURE__ */ jsxs(Flex, {
			elementDescriptor: descriptors.selectOptionsContainer,
			elementId: descriptors.selectOptionsContainer.setId(elementId),
			ref: floating,
			...floatingProps,
			direction: "col",
			justify: "start",
			sx: [(theme) => ({
				backgroundColor: colors.makeSolid(theme.colors.$colorBackground),
				borderRadius: theme.radii.$lg,
				overflow: "hidden",
				animation: `${animations.dropdownSlideInScaleAndFade} ${theme.transitionDuration.$slower} ${theme.transitionTiming.$slowBezier}`,
				transformOrigin: "top center",
				boxShadow: theme.shadows.$menuShadow,
				zIndex: theme.zIndices.$dropdown
			}), sx],
			style: styles,
			children: [comparator && /* @__PURE__ */ jsx(SelectSearchbar, {
				placeholder: searchPlaceholder,
				role: "combobox",
				"aria-expanded": isOpen,
				"aria-controls": effectiveListboxId,
				"aria-autocomplete": "list",
				"aria-activedescendant": activeDescendant,
				...searchInputProps
			}), /* @__PURE__ */ jsxs(Flex, {
				ref: containerRef,
				id: effectiveListboxId,
				direction: "col",
				role: "listbox",
				"aria-label": ariaLabel,
				"aria-labelledby": effectiveAriaLabelledBy,
				"aria-activedescendant": comparator ? void 0 : activeDescendant,
				tabIndex: comparator ? void 0 : 0,
				sx: [(theme) => ({
					gap: theme.space.$0x5,
					outline: "none",
					overflowY: "auto",
					maxHeight: "18vh",
					padding: `${theme.space.$0x5} ${theme.space.$0x5}`
				}), containerSx],
				...rest,
				children: [
					/* @__PURE__ */ jsx(FloatingList, {
						elementsRef,
						children: options.map((option, index) => {
							const isFocused = index === activeIndex;
							const isSelected = value === option.value;
							return /* @__PURE__ */ jsx(SelectRenderOption, {
								index,
								id: optionId(index),
								option,
								renderOption,
								getItemProps,
								isSelected,
								isFocused,
								handleSelect: select,
								elementId
							}, option.value);
						})
					}),
					noResultsMessage && options.length === 0 && /* @__PURE__ */ jsx(SelectNoResults, { children: noResultsMessage }),
					footer
				]
			})]
		})
	});
};
const SelectButton = (props) => {
	const { sx, children, icon, iconSx, id, "aria-controls": ariaControls, ...rest } = props;
	const { popoverCtx, onTriggerClick, buttonRenderOption, selectedOption, placeholder, elementId, generatedTriggerId, listboxId, setTriggerId, getReferenceProps } = useSelectState();
	const { reference, isOpen } = popoverCtx;
	const effectiveTriggerId = id ?? generatedTriggerId;
	React.useEffect(() => {
		setTriggerId(effectiveTriggerId);
	}, [effectiveTriggerId, setTriggerId]);
	let show = children;
	if (!children) show = selectedOption ? buttonRenderOption(selectedOption) : /* @__PURE__ */ jsx(Text, {
		as: "span",
		children: placeholder
	});
	return /* @__PURE__ */ jsxs(Button, {
		elementDescriptor: descriptors.selectButton,
		elementId: descriptors.selectButton.setId(elementId),
		ref: reference,
		id: effectiveTriggerId,
		variant: "outline",
		textVariant: "buttonLarge",
		...getReferenceProps({ onClick: onTriggerClick }),
		"aria-expanded": isOpen,
		"aria-haspopup": "listbox",
		"aria-controls": ariaControls ?? (isOpen ? listboxId : void 0),
		sx: [(theme) => ({
			gap: theme.space.$2,
			paddingInlineStart: theme.space.$3x5,
			paddingInlineEnd: theme.space.$3x5,
			alignItems: "center",
			"> *": { pointerEvents: "none" }
		}), sx],
		...rest,
		children: [show, /* @__PURE__ */ jsx(Icon, {
			elementDescriptor: descriptors.selectButtonIcon,
			elementId: descriptors.selectButtonIcon.setId(elementId),
			size: "md",
			icon: icon || SvgChevronDown,
			sx: iconSx
		})]
	});
};

//#endregion
export { Select, SelectButton, SelectOptionList };
//# sourceMappingURL=Select.js.map