import SvgArrowRight from "../../icons/arrow-right.js";
import SvgPlus from "../../icons/plus.js";
import SvgRotateLeftRight from "../../icons/rotate-left-right.js";
import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSubscriberTypeContext, useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Icon, SimpleButton, Span, Spinner } from "../../customizables/index.js";
import { Alert } from "../../elements/Alert.js";
import { Header } from "../../elements/Header.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { formatDate } from "../../utils/formatDate.js";
import { getDiscountDescription } from "../../utils/billing.js";
import { Statement } from "./Statement.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { __internal_useStatementQuery } from "@clerk/shared/react/index";

//#region src/components/Statements/StatementPage.tsx
const StatementPage = () => {
	const { params, navigate } = useRouter();
	const subscriberType = useSubscriberTypeContext();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const { t, translateError, $ } = useLocalizations();
	const requesterType = subscriberType === "organization" ? "organization" : "user";
	const { data: statement, isLoading, error } = __internal_useStatementQuery({
		statementId: params.statementId,
		for: requesterType,
		enabled: Boolean(params.statementId)
	});
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
			onClick: () => void navigate("../../", { searchParams: new URLSearchParams("tab=statements") }),
			children: /* @__PURE__ */ jsx(Header.Title, {
				localizationKey: localizationKeys(`${localizationRoot}.billingPage.statementsSection.title`),
				textVariant: "h2"
			})
		})
	}), !statement ? /* @__PURE__ */ jsx(Box, {
		sx: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "100%"
		},
		children: /* @__PURE__ */ jsx(Alert, {
			variant: "danger",
			colorScheme: "danger",
			children: error ? translateError(error.errors[0]) : t(localizationKeys(`${localizationRoot}.billingPage.statementsSection.notFound`))
		})
	}) : /* @__PURE__ */ jsxs(Statement.Root, { children: [
		/* @__PURE__ */ jsx(Statement.Header, {
			title: formatDate(statement.timestamp, "monthyear"),
			id: statement.id,
			status: statement.status
		}),
		/* @__PURE__ */ jsx(Statement.Body, { children: statement.groups.map((group) => /* @__PURE__ */ jsxs(Statement.Section, { children: [/* @__PURE__ */ jsx(Statement.SectionHeader, { text: formatDate(group.timestamp, "long") }), /* @__PURE__ */ jsx(Statement.SectionContent, { children: group.items.map((item) => /* @__PURE__ */ jsxs(Statement.SectionContentItem, { children: [/* @__PURE__ */ jsx(Statement.SectionContentDetailsHeader, {
			title: item.subscriptionItem.plan.name,
			description: `${item.subscriptionItem.amount ? $(item.subscriptionItem.amount) : ""} / ${item.subscriptionItem.planPeriod === "month" ? t(localizationKeys("billing.month")) : t(localizationKeys("billing.year"))}`,
			secondaryTitle: $(item.amount)
		}), /* @__PURE__ */ jsxs(Statement.SectionContentDetailsList, { children: [
			/* @__PURE__ */ jsx(Statement.SectionContentDetailsListItem, {
				label: item.chargeType === "recurring" ? localizationKeys(`${localizationRoot}.billingPage.statementsSection.itemCaption__paidForPlan`, {
					plan: item.subscriptionItem.plan.name,
					period: item.subscriptionItem.planPeriod
				}) : localizationKeys(`${localizationRoot}.billingPage.statementsSection.itemCaption__subscribedAndPaidForPlan`, {
					plan: item.subscriptionItem.plan.name,
					period: item.subscriptionItem.planPeriod
				}),
				labelIcon: item.chargeType === "recurring" ? SvgRotateLeftRight : SvgPlus,
				value: /* @__PURE__ */ jsxs(SimpleButton, {
					onClick: () => void navigate(`../../payment-attempt/${item.id}`),
					variant: "link",
					colorScheme: "primary",
					textVariant: "buttonSmall",
					sx: (t) => ({ gap: t.space.$1 }),
					children: [/* @__PURE__ */ jsx(Span, { localizationKey: localizationKeys("billing.viewPayment") }), /* @__PURE__ */ jsx(Icon, {
						icon: SvgArrowRight,
						size: "sm",
						"aria-hidden": true
					})]
				})
			}),
			item.totals?.discounts?.proration && item.totals.discounts.proration.amount.amount > 0 ? /* @__PURE__ */ jsx(Statement.SectionContentDetailsListItem, {
				label: localizationKeys("billing.proratedDiscount"),
				value: `(${$(item.totals.discounts.proration.amount)})`
			}) : null,
			item.totals?.discounts?.discount && item.totals.discounts.discount.amount.amount > 0 ? /* @__PURE__ */ jsx(Statement.SectionContentDetailsListItem, {
				label: `${item.totals.discounts.discount.name} ${getDiscountDescription(item.totals.discounts.discount, item.totals.discounts.discount.durationInCycles, item.subscriptionItem.planPeriod, {
					$,
					t
				})}`,
				value: `(${$(item.totals.discounts.discount.amount)})`
			}) : null,
			item.subscriptionItem.credits && item.subscriptionItem.credits.proration && item.subscriptionItem.credits.proration.amount.amount > 0 ? /* @__PURE__ */ jsx(Statement.SectionContentDetailsListItem, {
				label: localizationKeys(`${localizationRoot}.billingPage.statementsSection.itemCaption__proratedCredit`),
				value: `(${$(item.subscriptionItem.credits.proration.amount)})`
			}) : null,
			item.subscriptionItem.credits && item.subscriptionItem.credits.payer && item.subscriptionItem.credits.payer.appliedAmount.amount > 0 ? /* @__PURE__ */ jsx(Statement.SectionContentDetailsListItem, {
				label: localizationKeys(`${localizationRoot}.billingPage.statementsSection.itemCaption__payerCredit`),
				value: `(${$(item.subscriptionItem.credits.payer.appliedAmount)})`
			}) : null
		] })] }, item.id)) })] }, group.timestamp.toISOString())) }),
		/* @__PURE__ */ jsx(Statement.Footer, {
			label: localizationKeys(`${localizationRoot}.billingPage.statementsSection.totalPaid`),
			value: $(statement.totals.grandTotal)
		})
	] })] });
};

//#endregion
export { StatementPage };
//# sourceMappingURL=StatementPage.js.map