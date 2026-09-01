import React from "react";

//#region src/hooks/useSearchInput.ts
const useSearchInput = (props) => {
	const { items, comparator, searchTermForItem } = props;
	const [searchTerm, setSearchTerm] = React.useState("");
	const onChange = (e) => setSearchTerm(e.target.value || "");
	const searchTermMap = React.useMemo(() => {
		return items.reduce((acc, item) => {
			acc.set(item, searchTermForItem?.(item));
			return acc;
		}, /* @__PURE__ */ new Map());
	}, [items]);
	const filteredItems = React.useMemo(() => searchTerm ? items.filter((i) => comparator(searchTerm, i, searchTermMap.get(i))) : items, [items, searchTerm]);
	return {
		searchInputProps: {
			onChange,
			value: searchTerm
		},
		filteredItems
	};
};

//#endregion
export { useSearchInput };
//# sourceMappingURL=useSearchInput.js.map