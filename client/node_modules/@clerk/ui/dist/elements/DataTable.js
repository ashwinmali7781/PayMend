import { descriptors } from "../customizables/elementDescriptors.js";
import { Col, Flex, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "../customizables/index.js";
import { Pagination } from "./Pagination.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/DataTable.tsx
const DataTable = (props) => {
	const { headers, page, onPageChange, rows, isLoading, itemCount, itemsPerPage, pageCount, emptyStateLocalizationKey } = props;
	const startingRow = itemCount > 0 ? Math.max(0, (page - 1) * itemsPerPage) + 1 : 0;
	const endingRow = Math.min(page * itemsPerPage, itemCount);
	return /* @__PURE__ */ jsxs(Col, {
		gap: 4,
		sx: { width: "100%" },
		children: [/* @__PURE__ */ jsx(Flex, {
			sx: (t) => ({
				overflowX: "auto",
				padding: t.space.$1
			}),
			children: /* @__PURE__ */ jsxs(Table, {
				sx: { tableLayout: "fixed" },
				children: [/* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsx(Tr, { children: headers.map((h, index) => /* @__PURE__ */ jsx(Th, {
					elementDescriptor: descriptors.tableHead,
					localizationKey: h.key,
					sx: [{ width: index === 0 ? "auto" : "25%" }, h.align ? { textAlign: h.align } : void 0]
				}, index)) }) }), /* @__PURE__ */ jsx(Tbody, { children: isLoading ? /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, {
					colSpan: 4,
					children: /* @__PURE__ */ jsx(Spinner, {
						colorScheme: "primary",
						sx: {
							margin: "auto",
							display: "block"
						},
						elementDescriptor: descriptors.spinner
					})
				}) }) : !rows.length ? /* @__PURE__ */ jsx(DataTableEmptyRow, { localizationKey: emptyStateLocalizationKey }, "empty") : rows })]
			})
		}), pageCount > 1 && /* @__PURE__ */ jsx(Pagination, {
			count: pageCount,
			page,
			onChange: onPageChange,
			siblingCount: 1,
			rowInfo: {
				allRowsCount: itemCount,
				startingRow,
				endingRow
			}
		})]
	});
};
const DataTableEmptyRow = (props) => {
	return /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, {
		colSpan: 4,
		children: /* @__PURE__ */ jsx(Text, {
			localizationKey: props.localizationKey,
			sx: {
				margin: "auto",
				display: "block",
				width: "fit-content"
			}
		})
	}) });
};
const DataTableRow = (props) => {
	return /* @__PURE__ */ jsx(Tr, {
		...props,
		sx: (t) => ({ ":hover": { backgroundColor: t.colors.$neutralAlpha50 } })
	});
};

//#endregion
export { DataTable, DataTableRow };
//# sourceMappingURL=DataTable.js.map