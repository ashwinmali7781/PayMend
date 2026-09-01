import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { useStatements } from "../../contexts/components/Plans.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { Td, Text } from "../../customizables/index.js";
import { truncateWithEndVisible } from "../../utils/truncateTextWithEndVisible.js";
import { formatDate } from "../../utils/formatDate.js";
import { DataTable, DataTableRow } from "../../elements/DataTable.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Statements/StatementsList.tsx
const StatementsList = () => {
	const { data: statements, isLoading, count } = useStatements();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	return /* @__PURE__ */ jsx(DataTable, {
		page: 1,
		onPageChange: (_) => {},
		itemCount: count,
		pageCount: 1,
		itemsPerPage: 10,
		isLoading,
		emptyStateLocalizationKey: localizationKeys(`${localizationRoot}.billingPage.statementsSection.empty`),
		headers: [{ key: localizationKeys(`${localizationRoot}.billingPage.statementsSection.tableHeader__date`) }, { key: localizationKeys(`${localizationRoot}.billingPage.statementsSection.tableHeader__amount`) }],
		rows: statements.map((i) => /* @__PURE__ */ jsx(StatementsListRow, { statement: i }, i.id))
	});
};
const StatementsListRow = ({ statement }) => {
	const { timestamp, id, totals: { grandTotal } } = statement;
	const { navigate } = useRouter();
	const { $ } = useLocalizations();
	const handleClick = () => {
		navigate(`statement/${id}`);
	};
	return /* @__PURE__ */ jsxs(DataTableRow, {
		onClick: handleClick,
		children: [/* @__PURE__ */ jsxs(Td, {
			sx: { cursor: "pointer" },
			children: [/* @__PURE__ */ jsx(Text, {
				variant: "subtitle",
				children: formatDate(timestamp, "monthyear")
			}), /* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				variant: "caption",
				truncate: true,
				sx: (t) => ({ marginTop: t.space.$0x5 }),
				children: truncateWithEndVisible(id)
			})]
		}), /* @__PURE__ */ jsx(Td, {
			sx: { cursor: "pointer" },
			children: /* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				children: $(grandTotal)
			})
		})]
	});
};

//#endregion
export { StatementsList };
//# sourceMappingURL=StatementsList.js.map