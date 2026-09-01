import { localizationKeys } from "../localization/localizationKeys.js";
import SvgMagnifyingGlass from "../icons/magnifying-glass.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { Spinner } from "../primitives/Spinner.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Icon } from "../customizables/index.js";
import { InputWithIcon } from "./InputWithIcon.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/SearchInput.tsx
/**
* A search input preset: a magnifying-glass icon (or spinner while loading) and a trailing clear
* button that all search inputs share. The clear button uses the single `searchInputClearButton`
* appearance element and a shared clear label, so new search inputs don't introduce their own.
*/
const SearchInput = React.forwardRef(function SearchInput({ isLoading, leftIconElementDescriptor, clearButtonLabel, elementDescriptor, ...rest }, ref) {
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsx(InputWithIcon, {
		ref,
		type: "search",
		autoComplete: "off",
		autoCapitalize: "none",
		spellCheck: false,
		elementDescriptor: [descriptors.searchInput, ...Array.isArray(elementDescriptor) ? elementDescriptor : [elementDescriptor]],
		leftIcon: isLoading ? /* @__PURE__ */ jsx(Spinner, { size: "xs" }) : /* @__PURE__ */ jsx(Icon, {
			icon: SvgMagnifyingGlass,
			elementDescriptor: leftIconElementDescriptor,
			sx: (theme) => ({ color: theme.colors.$colorMutedForeground })
		}),
		clearButtonLabel: clearButtonLabel ?? t(localizationKeys("searchInput.action__clear")),
		clearButtonElementDescriptor: descriptors.searchInputClearButton,
		...rest
	});
});

//#endregion
export { SearchInput };
//# sourceMappingURL=SearchInput.js.map