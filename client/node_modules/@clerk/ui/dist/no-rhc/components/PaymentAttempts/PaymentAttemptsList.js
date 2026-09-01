import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { usePaymentAttempts } from "../../contexts/components/Plans.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { Badge, Td, Text } from "../../customizables/index.js";
import { truncateWithEndVisible } from "../../utils/truncateTextWithEndVisible.js";
import { formatDate } from "../../utils/formatDate.js";
import { DataTable, DataTableRow } from "../../elements/DataTable.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/PaymentAttempts/PaymentAttemptsList.tsx
const PaymentAttemptsList = () => {
	const { data: paymentAttempts, isLoading, count } = usePaymentAttempts();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	return /* @__PURE__ */ jsx(DataTable, {
		page: 1,
		onPageChange: (_) => {},
		itemCount: count,
		pageCount: 1,
		itemsPerPage: 10,
		isLoading,
		emptyStateLocalizationKey: localizationKeys(`${localizationRoot}.billingPage.paymentHistorySection.empty`),
		headers: [
			{ key: localizationKeys(`${localizationRoot}.billingPage.paymentHistorySection.tableHeader__date`) },
			{ key: localizationKeys(`${localizationRoot}.billingPage.paymentHistorySection.tableHeader__amount`) },
			{ key: localizationKeys(`${localizationRoot}.billingPage.paymentHistorySection.tableHeader__status`) }
		],
		rows: paymentAttempts.map((i) => /* @__PURE__ */ jsx(PaymentAttemptsListRow, { paymentAttempt: i }, i.id))
	});
};
const PaymentAttemptsListRow = ({ paymentAttempt }) => {
	const { id, amount, failedAt, paidAt, updatedAt, status } = paymentAttempt;
	const { navigate } = useRouter();
	const { $ } = useLocalizations();
	const handleClick = () => {
		navigate(`payment-attempt/${id}`);
	};
	return /* @__PURE__ */ jsxs(DataTableRow, {
		onClick: handleClick,
		children: [
			/* @__PURE__ */ jsxs(Td, {
				sx: { cursor: "pointer" },
				children: [/* @__PURE__ */ jsx(Text, {
					variant: "subtitle",
					children: formatDate(paidAt || failedAt || updatedAt, "long")
				}), /* @__PURE__ */ jsx(Text, {
					colorScheme: "secondary",
					variant: "caption",
					truncate: true,
					sx: (t) => ({ marginTop: t.space.$0x5 }),
					children: truncateWithEndVisible(id)
				})]
			}),
			/* @__PURE__ */ jsx(Td, {
				sx: { cursor: "pointer" },
				children: /* @__PURE__ */ jsx(Text, { children: $(amount) })
			}),
			/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Badge, {
				colorScheme: status === "paid" ? "success" : status === "failed" ? "danger" : "primary",
				sx: { textTransform: "capitalize" },
				children: status
			}) })
		]
	});
};

//#endregion
export { PaymentAttemptsList };
//# sourceMappingURL=PaymentAttemptsList.js.map