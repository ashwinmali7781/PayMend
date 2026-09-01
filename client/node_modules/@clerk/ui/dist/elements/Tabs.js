import { useLocalizations } from "../localization/makeLocalizable.js";
import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Button, Flex } from "../customizables/index.js";
import { getValidChildren } from "../utils/getValidReactChildren.js";
import React from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Tabs.tsx
const [TabsContext, useTabsContext] = createContextAndHook("TabsContext");
const TabsContextProvider = (props) => {
	const ctxValue = React.useMemo(() => ({ value: props.value }), [props.value.selectedIndex, props.value.setFocusedIndex]);
	return /* @__PURE__ */ jsx(TabsContext.Provider, {
		value: ctxValue,
		children: props.children
	});
};
const Tabs = (props) => {
	const { value, onChange, defaultIndex = 0, children } = props;
	const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);
	const [focusedIndex, setFocusedIndex] = React.useState(-1);
	const handleSelectedIndexChange = React.useCallback((newIndex) => {
		if (onChange) onChange(newIndex);
		else setSelectedIndex(newIndex);
	}, [onChange]);
	return /* @__PURE__ */ jsx(TabsContextProvider, {
		value: {
			selectedIndex: value !== void 0 ? value : selectedIndex,
			setSelectedIndex: handleSelectedIndexChange,
			focusedIndex,
			setFocusedIndex
		},
		children
	});
};
const TabsList = (props) => {
	const { children, sx, ...rest } = props;
	const { setSelectedIndex, selectedIndex, setFocusedIndex } = useTabsContext();
	let index = 0;
	const childrenWithProps = getValidChildren(children).map((child) => {
		const el = React.cloneElement(child, { tabIndex: child.type === Tab ? index : void 0 });
		index++;
		return el;
	});
	const onKeyDown = (e) => {
		const tabs = childrenWithProps.filter((child) => !child.props?.isDisabled && child.type === Tab).map((child) => child.props.tabIndex);
		const tabsLenth = tabs.length;
		const current = tabs.indexOf(selectedIndex);
		if (e.key === "ArrowLeft") {
			const prev = current === 0 ? tabs[tabsLenth - 1] : tabs[current - 1];
			setFocusedIndex(prev);
			return setSelectedIndex(prev);
		}
		if (e.key === "ArrowRight") {
			const next = tabsLenth - 1 === current ? tabs[0] : tabs[current + 1];
			setFocusedIndex(next);
			return setSelectedIndex(next);
		}
	};
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.tabListContainer,
		onKeyDown,
		role: "tablist",
		sx: [(t) => ({
			borderBottomStyle: t.borderStyles.$solid,
			borderBottomWidth: t.borderWidths.$normal,
			borderColor: t.colors.$borderAlpha100
		}), sx],
		...rest,
		children: childrenWithProps
	});
};
const Tab = (props) => {
	const { t } = useLocalizations();
	const { children, sx, tabIndex, isDisabled, localizationKey, ...rest } = props;
	if (tabIndex === void 0) throw new Error("Tab component must be a direct child of TabList.");
	const { setSelectedIndex, selectedIndex, focusedIndex, setFocusedIndex } = useTabsContext();
	const buttonRef = React.useRef(null);
	const isActive = tabIndex === selectedIndex;
	const isFocused = tabIndex === focusedIndex;
	const onClick = () => {
		setSelectedIndex(tabIndex);
		setFocusedIndex(-1);
	};
	React.useEffect(() => {
		if (isDisabled && tabIndex === 0) setSelectedIndex(tabIndex + 1);
	}, []);
	React.useEffect(() => {
		if (buttonRef.current && isFocused) buttonRef.current.focus();
	}, [isFocused]);
	return /* @__PURE__ */ jsxs(Button, {
		elementDescriptor: descriptors.tabButton,
		onClick,
		isDisabled,
		tabIndex: isActive ? 0 : -1,
		variant: "ghost",
		"aria-selected": isActive,
		id: `cl-tab-${tabIndex}`,
		"aria-controls": `cl-tabpanel-${tabIndex}`,
		role: "tab",
		ref: buttonRef,
		sx: [(t) => ({
			background: t.colors.$transparent,
			color: isActive ? t.colors.$primary500 : t.colors.$neutralAlpha700,
			gap: t.space.$1x5,
			fontWeight: t.fontWeights.$medium,
			borderBottomWidth: isActive ? t.borderWidths.$normal : 0,
			borderBottomStyle: t.borderStyles.$solid,
			borderBottomColor: t.colors.$primary500,
			marginBottom: isActive ? "-1px" : 0,
			borderRadius: 0,
			padding: `${t.space.$2x5} ${t.space.$0x25}`,
			width: "fit-content",
			"&:hover, &:focus-visible": {
				backgroundColor: t.colors.$transparent,
				boxShadow: "none"
			},
			"&:focus-visible": { ...common.focusRing(t) }
		}), sx],
		...rest,
		children: [t(localizationKey), children]
	});
};
const TabPanels = (props) => {
	const { children } = props;
	return /* @__PURE__ */ jsx(Fragment$1, { children: getValidChildren(children).map((child, index) => React.cloneElement(child, { tabIndex: index })) });
};
const TabPanel = (props) => {
	const { tabIndex, sx, children, ...rest } = props;
	if (tabIndex === void 0) throw new Error("TabPanel component must be a direct child of TabPanels.");
	const { selectedIndex } = useTabsContext();
	if (!(tabIndex === selectedIndex)) return null;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.tabPanel,
		id: `cl-tabpanel-${tabIndex}`,
		role: "tabpanel",
		tabIndex: 0,
		"aria-labelledby": `cl-tab-${tabIndex}`,
		sx: [{ outline: 0 }, sx],
		...rest,
		children
	});
};

//#endregion
export { Tab, TabPanel, TabPanels, Tabs, TabsList };
//# sourceMappingURL=Tabs.js.map