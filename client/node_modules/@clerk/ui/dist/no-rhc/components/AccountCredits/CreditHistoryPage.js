import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { useCreditHistory } from "../../contexts/components/Plans.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "../../customizables/index.js";
import { Header } from "../../elements/Header.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/AccountCredits/CreditHistoryPage.tsx
const CreditHistoryPage = () => {
	const { navigate } = useRouter();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const { $, locale } = useLocalizations();
	const { data: creditHistory, isLoading } = useCreditHistory();
	const formatCreditDate = (date) => new Intl.DateTimeFormat(locale, {
		month: "short",
		day: "numeric",
		year: "numeric"
	}).format(date);
	if (isLoading) return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsx(Box, {
		sx: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "100%"
		},
		children: /* @__PURE__ */ jsx(Spinner, {
			colorScheme: "primary",
			sx: {
				margin: "auto",
				display: "block"
			},
			elementDescriptor: descriptors.spinner
		})
	}) });
	return /* @__PURE__ */ jsxs(ProfileCard.Page, { children: [/* @__PURE__ */ jsx(Header.Root, {
		sx: (t) => ({
			borderBlockEndWidth: t.borderWidths.$normal,
			borderBlockEndStyle: t.borderStyles.$solid,
			borderBlockEndColor: t.colors.$borderAlpha100,
			marginBlockEnd: t.space.$4,
			paddingBlockEnd: t.space.$4
		}),
		children: /* @__PURE__ */ jsx(Header.BackLink, {
			onClick: () => void navigate("../"),
			children: /* @__PURE__ */ jsx(Header.Title, {
				localizationKey: localizationKeys(`${localizationRoot}.billingPage.creditHistoryPage.title`),
				textVariant: "h2"
			})
		})
	}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, {
		sx: (t) => ({ background: t.colors.$neutralAlpha25 }),
		children: [/* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys(`${localizationRoot}.billingPage.creditHistoryPage.tableHeader__amount`) }), /* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys(`${localizationRoot}.billingPage.creditHistoryPage.tableHeader__date`) })]
	}) }), /* @__PURE__ */ jsx(Tbody, { children: creditHistory?.data?.map((entry) => /* @__PURE__ */ jsxs(Tr, { children: [/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Text, {
		variant: "subtitle",
		children: $(entry.amount)
	}) }), /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Text, {
		variant: "body",
		children: formatCreditDate(entry.createdAt)
	}) })] }, entry.id)) })] })] });
};

//#endregion
export { CreditHistoryPage };
//# sourceMappingURL=CreditHistoryPage.js.map