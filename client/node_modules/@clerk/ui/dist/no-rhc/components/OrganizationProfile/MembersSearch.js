import { localizationKeys } from "../../localization/localizationKeys.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flex } from "../../customizables/index.js";
import { Animated } from "../../elements/Animated.js";
import { SearchInput } from "../../elements/SearchInput.js";
import { useEffect, useRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/MembersSearch.tsx
const membersSearchDebounceMs = 500;
const MembersSearch = ({ query, value, memberships, onSearchChange, onQueryTrigger }) => {
	const { t } = useLocalizations();
	const debounceTimer = useRef(null);
	const handleChange = (event) => {
		const eventValue = event.target.value;
		onSearchChange(eventValue);
		if (eventValue === "") onQueryTrigger(eventValue);
	};
	function handleKeyUp() {
		if (debounceTimer.current) clearTimeout(debounceTimer.current);
		debounceTimer.current = setTimeout(() => {
			onQueryTrigger(value.trim());
		}, membersSearchDebounceMs);
	}
	const handleClear = () => {
		if (debounceTimer.current) clearTimeout(debounceTimer.current);
		onSearchChange("");
		onQueryTrigger("");
	};
	useEffect(() => {
		if (!query || !memberships?.data) return;
		if ((memberships?.count ?? 0) <= 10) memberships?.fetchPage?.(1);
	}, [query, memberships]);
	const isFetchingNewData = value && !!memberships?.isLoading && !!memberships.data?.length;
	return /* @__PURE__ */ jsx(Animated, {
		asChild: true,
		children: /* @__PURE__ */ jsx(Flex, {
			sx: {
				width: "50%",
				[mqu.sm]: { width: "auto" }
			},
			children: /* @__PURE__ */ jsx(SearchInput, {
				value,
				isLoading: !!isFetchingNewData,
				"aria-label": "Search",
				placeholder: t(localizationKeys("organizationProfile.membersPage.action__search")),
				leftIconElementDescriptor: descriptors.organizationProfileMembersSearchInputIcon,
				onKeyUp: handleKeyUp,
				onChange: handleChange,
				onClear: handleClear,
				elementDescriptor: descriptors.organizationProfileMembersSearchInput
			})
		})
	});
};

//#endregion
export { MembersSearch };
//# sourceMappingURL=MembersSearch.js.map