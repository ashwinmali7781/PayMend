import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgCheckmark from "../../icons/checkmark.js";
import SvgPlus from "../../icons/plus.js";
import SvgUserCircle from "../../icons/user-circle.js";
import SvgUsers from "../../icons/users.js";
import { useProtect } from "../../common/Gate.js";
import { getPlanSeatLimit, getSeatUnitPrice, organizationExceedsPlanSeatLimit } from "../../utils/billingPlanSeats.js";
import { getClosestProfileScrollBox } from "../../utils/getClosestProfileScrollBox.js";
import { useSubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { usePlansContext } from "../../contexts/components/Plans.js";
import { usePricingTableContext } from "../../contexts/components/PricingTable.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { InternalThemeProvider } from "../../styledSystem/InternalThemeProvider.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Badge, Box, Button, Col, Flex, Heading, Icon, SimpleButton, Span, Text } from "../../customizables/index.js";
import { Tooltip } from "../../elements/Tooltip.js";
import { SubscriptionBadge } from "../Subscriptions/badge.js";
import { Switch } from "../../elements/Switch.js";
import { getPricingFooterState } from "./utils/pricing-footer-state.js";
import * as React$1 from "react";
import { __internal_useOrganizationBase, useClerk, useSession } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/PricingTable/PricingTableDefault.tsx
function PricingTableDefault({ plans, highlightedPlan, planPeriod, setPlanPeriod, onSelect, isCompact, props }) {
	return /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.pricingTable,
		sx: (t) => ({
			"--grid-min-size": isCompact ? "11.75rem" : "20rem",
			"--grid-max-columns": "infinity",
			"--grid-gap": t.space.$4,
			"--max-column-width": "100% / var(--grid-max-columns, infinity) - var(--grid-gap)",
			"--column-width": "max(var(--max-column-width), min(var(--grid-min-size, 10rem), 100%))",
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(var(--column-width), 1fr))",
			gridTemplateRows: "auto 1fr",
			gap: `var(--grid-gap-y, var(--grid-gap, ${t.space.$4})) var(--grid-gap, ${t.space.$4})`,
			alignItems: "stretch",
			width: "100%",
			minWidth: "0"
		}),
		"data-variant": isCompact ? "compact" : "default",
		children: plans?.map((plan) => /* @__PURE__ */ jsx(Card, {
			plan,
			highlighted: plan.slug === highlightedPlan,
			planPeriod,
			setPlanPeriod,
			onSelect,
			props,
			isCompact
		}, plan.id))
	}) });
}
function Card(props) {
	const { plan, highlighted, planPeriod, setPlanPeriod, onSelect, props: pricingTableProps, isCompact = false } = props;
	const clerk = useClerk();
	const { isSignedIn } = useSession();
	const { mode = "mounted", ctaPosition: ctxCtaPosition } = usePricingTableContext();
	const subscriberType = useSubscriberTypeContext();
	const organization = __internal_useOrganizationBase();
	const ctaPosition = pricingTableProps.ctaPosition || ctxCtaPosition || "bottom";
	const collapseFeatures = pricingTableProps.collapseFeatures || false;
	const { id, slug } = plan;
	const canManageBilling = useProtect((has) => has({ permission: "org:sys_billing:manage" }) || subscriberType === "user");
	const { buttonPropsForPlan, activeOrUpcomingSubscriptionBasedOnPlanPeriod } = usePlansContext();
	const showPlanDetails = (event) => {
		const portalRoot = getClosestProfileScrollBox(mode, event);
		clerk.__internal_openPlanDetails({
			plan,
			initialPlanPeriod: planPeriod,
			portalRoot
		});
	};
	const subscription = React$1.useMemo(() => activeOrUpcomingSubscriptionBasedOnPlanPeriod(plan, planPeriod), [
		plan,
		planPeriod,
		activeOrUpcomingSubscriptionBasedOnPlanPeriod
	]);
	const footerButtonTooltipText = React$1.useMemo(() => {
		if (isSignedIn && !canManageBilling) return localizationKeys("organizationProfile.plansPage.alerts.noPermissionsToManageBilling");
		if (organization && subscriberType === "organization" && organizationExceedsPlanSeatLimit(plan, organization)) {
			const seatLimit = getPlanSeatLimit(plan);
			return localizationKeys("organizationProfile.plansPage.alerts.planMembershipLimitExceeded", {
				count: organization.membersCount + organization.pendingInvitationsCount,
				limit: seatLimit
			});
		}
		return null;
	}, [
		isSignedIn,
		canManageBilling,
		organization,
		subscriberType,
		plan
	]);
	const hasFeatures = plan.features.length > 0;
	const hasSeatFeatures = !!getSeatUnitPrice(plan);
	const { shouldShowFooter, shouldShowFooterNotice } = getPricingFooterState({
		subscription,
		plan,
		planPeriod,
		for: pricingTableProps.for,
		hasActiveOrganization: !!organization
	});
	return /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.pricingTableCard,
		elementId: descriptors.pricingTableCard.setId(slug),
		sx: (t) => ({
			display: "grid",
			gap: 0,
			gridTemplateRows: "subgrid",
			gridRow: "span 5",
			background: common.mutedBackground(t),
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha150,
			borderRadius: t.radii.$xl,
			overflow: "hidden",
			textAlign: "start"
		}),
		"data-variant": isCompact ? "compact" : "default",
		children: [/* @__PURE__ */ jsx(CardHeader, {
			plan,
			isCompact,
			planPeriod,
			setPlanPeriod,
			badge: subscription ? /* @__PURE__ */ jsx(SubscriptionBadge, { subscription: subscription.isFreeTrial ? { status: "free_trial" } : subscription }) : highlighted ? /* @__PURE__ */ jsx(Badge, {
				elementDescriptor: descriptors.pricingTableCardBadge,
				colorScheme: "secondary",
				localizationKey: localizationKeys("billing.highlightedPlanBadge"),
				"data-highlighted-plan": true
			}) : void 0
		}), /* @__PURE__ */ jsxs(Box, {
			elementDescriptor: descriptors.pricingTableCardBody,
			sx: {
				display: "grid",
				gridTemplateRows: "subgrid",
				gridRow: "span 2",
				gap: 0
			},
			children: [ctaPosition === "bottom" && !collapseFeatures || ctaPosition === "top" && hasFeatures ? /* @__PURE__ */ jsx(Box, {
				elementDescriptor: descriptors.pricingTableCardFeatures,
				sx: (t) => ({
					display: "flex",
					flexDirection: "column",
					flex: "1",
					padding: isCompact ? t.space.$3 : t.space.$4,
					backgroundColor: hasFeatures || hasSeatFeatures ? t.colors.$colorBackground : "transparent",
					borderTopWidth: hasFeatures || hasSeatFeatures ? t.borderWidths.$normal : 0,
					borderTopStyle: t.borderStyles.$solid,
					borderTopColor: t.colors.$borderAlpha150
				}),
				"data-variant": isCompact ? "compact" : "default",
				children: /* @__PURE__ */ jsx(CardFeaturesList, {
					plan,
					isCompact,
					showPlanDetails
				})
			}) : null, shouldShowFooter ? /* @__PURE__ */ jsx(Box, {
				elementDescriptor: descriptors.pricingTableCardFooter,
				sx: (t) => ({
					marginTop: "auto",
					padding: isCompact ? t.space.$3 : t.space.$4,
					borderTopWidth: t.borderWidths.$normal,
					borderTopStyle: t.borderStyles.$solid,
					borderTopColor: t.colors.$borderAlpha150,
					order: ctaPosition === "top" ? -1 : void 0
				}),
				children: shouldShowFooterNotice && subscription ? /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.pricingTableCardFooterNotice,
					variant: isCompact ? "buttonSmall" : "buttonLarge",
					localizationKey: plan.freeTrialEnabled && subscription.isFreeTrial && subscription.periodEnd ? localizationKeys("badge__trialEndsAt", { date: subscription.periodEnd }) : localizationKeys("badge__startsAt", { date: subscription.periodStart }),
					colorScheme: "secondary",
					sx: (t) => ({
						paddingBlock: t.space.$1x5,
						textAlign: "center"
					})
				}) : /* @__PURE__ */ jsxs(Tooltip.Root, { children: [/* @__PURE__ */ jsx(Tooltip.Trigger, {
					sx: { width: "100%" },
					children: /* @__PURE__ */ jsx(Button, {
						elementDescriptor: descriptors.pricingTableCardFooterButton,
						block: true,
						textVariant: isCompact ? "buttonSmall" : "buttonLarge",
						...buttonPropsForPlan({
							plan,
							organization,
							isCompact,
							selectedPlanPeriod: planPeriod
						}),
						onClick: (event) => {
							onSelect(plan, event);
						}
					})
				}), footerButtonTooltipText ? /* @__PURE__ */ jsx(Tooltip.Content, { text: footerButtonTooltipText }) : null] })
			}) : /* @__PURE__ */ jsx(Box, { sx: (t) => ({ backgroundColor: hasFeatures ? t.colors.$colorBackground : "transparent" }) })]
		})]
	}, id);
}
const CardHeader = React$1.forwardRef((props, ref) => {
	const { plan, isCompact, planPeriod, setPlanPeriod, badge } = props;
	const { name } = plan;
	const { $ } = useLocalizations();
	const fee = React$1.useMemo(() => {
		if (!plan.annualMonthlyFee) return plan.fee;
		if (!plan.fee) return plan.annualFee;
		return planPeriod === "annual" ? plan.annualMonthlyFee : plan.fee;
	}, [plan, planPeriod]);
	const singleUnitPriceTierFee = React$1.useMemo(() => {
		if (plan.hasBaseFee || !plan.unitPrices || plan.unitPrices.length !== 1) return null;
		const [unitPrice] = plan.unitPrices;
		if (unitPrice.tiers.length !== 1) return null;
		return unitPrice.tiers[0].feePerBlock;
	}, [plan.hasBaseFee, plan.unitPrices]);
	const feePeriodText = React$1.useMemo(() => {
		if (!plan.hasBaseFee && plan.unitPrices && plan.unitPrices.length > 0) return localizationKeys("billing.monthPerUnit", { unitName: plan.unitPrices[0].name });
		return plan.fee ? localizationKeys("billing.month") : localizationKeys("billing.year");
	}, [
		plan.hasBaseFee,
		plan.fee,
		plan.unitPrices
	]);
	const displayedFee = singleUnitPriceTierFee ?? fee;
	const feeFormatted = React$1.useMemo(() => {
		if (!displayedFee) return "";
		return $(displayedFee, { style: "short" });
	}, [displayedFee, $]);
	return /* @__PURE__ */ jsxs(Box, {
		ref,
		elementDescriptor: descriptors.pricingTableCardHeader,
		sx: (t) => ({
			width: "100%",
			padding: isCompact ? t.space.$3 : t.space.$4,
			display: "grid",
			gap: t.space.$1,
			gridRow: "span 3",
			gridTemplateRows: "subgrid"
		}),
		"data-variant": isCompact ? "compact" : "default",
		children: [
			/* @__PURE__ */ jsxs(Box, {
				elementDescriptor: descriptors.pricingTableCardTitleContainer,
				children: [/* @__PURE__ */ jsxs(Box, {
					sx: (t) => ({
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						gap: t.space.$0x25
					}),
					children: [/* @__PURE__ */ jsx(Heading, {
						elementDescriptor: descriptors.pricingTableCardTitle,
						as: "h2",
						textVariant: isCompact ? "h3" : "h2",
						children: name
					}), badge && badge]
				}), !isCompact && plan.description ? /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.pricingTableCardDescription,
					variant: "subtitle",
					colorScheme: "secondary",
					sx: { justifySelf: "flex-start" },
					children: plan.description
				}) : null]
			}),
			/* @__PURE__ */ jsxs(Flex, {
				elementDescriptor: descriptors.pricingTableCardFeeContainer,
				"data-variant": isCompact ? "compact" : "default",
				align: "center",
				wrap: "wrap",
				sx: (t) => ({
					columnGap: t.space.$1,
					marginTop: t.space.$1
				}),
				children: [/* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.pricingTableCardFee,
					variant: isCompact ? "h2" : "h1",
					colorScheme: "body",
					children: feeFormatted
				}), !plan.isDefault ? /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.pricingTableCardFeePeriod,
					variant: "caption",
					colorScheme: "secondary",
					sx: (t) => ({
						textTransform: "lowercase",
						":before": {
							content: "\"/\"",
							marginInlineEnd: t.space.$0x25
						}
					}),
					localizationKey: feePeriodText
				}) : null]
			}),
			/* @__PURE__ */ jsx(PeriodToggle, {
				plan,
				planPeriod,
				setPlanPeriod
			})
		]
	});
});
const PeriodToggle = ({ plan, planPeriod, setPlanPeriod }) => {
	if (!plan.isDefault && plan.fee && plan.annualMonthlyFee) return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.pricingTableCardPeriodToggle,
		sx: (t) => ({ marginTop: t.space.$1 }),
		children: /* @__PURE__ */ jsx(Switch, {
			isChecked: planPeriod === "annual",
			onChange: (checked) => setPlanPeriod(checked ? "annual" : "month"),
			label: localizationKeys("billing.billedAnnually")
		})
	});
	if (plan.annualMonthlyFee) return /* @__PURE__ */ jsx(Text, {
		elementDescriptor: descriptors.pricingTableCardFeePeriodNotice,
		variant: "caption",
		colorScheme: "secondary",
		localizationKey: plan.isDefault ? localizationKeys("billing.alwaysFree") : localizationKeys("billing.billedAnnuallyOnly"),
		sx: (t) => ({
			justifySelf: "flex-start",
			alignSelf: "center",
			marginTop: t.space.$1
		})
	});
	return /* @__PURE__ */ jsx(Text, {
		elementDescriptor: descriptors.pricingTableCardFeePeriodNotice,
		variant: "caption",
		colorScheme: "secondary",
		localizationKey: plan.isDefault ? localizationKeys("billing.alwaysFree") : localizationKeys("billing.billedMonthlyOnly"),
		sx: (t) => ({
			justifySelf: "flex-start",
			alignSelf: "center",
			marginTop: t.space.$1
		})
	});
};
const CardFeaturesList = React$1.forwardRef((props, ref) => {
	const { plan, isCompact, showPlanDetails } = props;
	const totalFeatures = plan.features.length;
	const hasMoreFeatures = isCompact ? totalFeatures > 3 : totalFeatures > 8;
	return /* @__PURE__ */ jsxs(Box, {
		ref,
		elementDescriptor: descriptors.pricingTableCardFeatures,
		sx: (t) => ({
			display: "grid",
			flex: 1,
			rowGap: isCompact ? t.space.$2 : t.space.$3
		}),
		children: [/* @__PURE__ */ jsxs(Col, {
			elementDescriptor: descriptors.pricingTableCardFeaturesList,
			"data-variant": isCompact ? "compact" : "default",
			as: "ul",
			role: "list",
			sx: (t) => ({
				flex: "1",
				rowGap: isCompact ? t.space.$2 : t.space.$3,
				margin: 0,
				padding: 0
			}),
			children: [plan.unitPrices && plan.unitPrices.length > 0 && (plan.hasBaseFee || plan.unitPrices[0].tiers.length > 0) ? /* @__PURE__ */ jsx(CardFeaturesListSeatCost, { plan }) : null, plan.features.slice(0, hasMoreFeatures ? isCompact ? 3 : 8 : totalFeatures).map((feature) => /* @__PURE__ */ jsxs(Box, {
				elementDescriptor: descriptors.pricingTableCardFeaturesListItem,
				elementId: descriptors.pricingTableCardFeaturesListItem.setId(feature.slug),
				as: "li",
				sx: (t) => ({
					display: "flex",
					alignItems: "baseline",
					gap: t.space.$2,
					margin: 0,
					padding: 0
				}),
				children: [/* @__PURE__ */ jsx(Icon, {
					icon: SvgCheckmark,
					colorScheme: "neutral",
					"aria-hidden": true,
					sx: (t) => ({ transform: `translateY(${t.space.$0x25})` })
				}), /* @__PURE__ */ jsx(Span, {
					elementDescriptor: descriptors.pricingTableCardFeaturesListItemContent,
					children: /* @__PURE__ */ jsx(Text, {
						elementDescriptor: descriptors.pricingTableCardFeaturesListItemTitle,
						colorScheme: "body",
						sx: (t) => ({ fontWeight: t.fontWeights.$normal }),
						children: feature.name
					})
				})]
			}, feature.id))]
		}), hasMoreFeatures && /* @__PURE__ */ jsxs(SimpleButton, {
			onClick: (event) => showPlanDetails(event),
			variant: "link",
			sx: (t) => ({
				marginBlockStart: "auto",
				paddingBlock: t.space.$1,
				gap: t.space.$2
			}),
			children: [/* @__PURE__ */ jsx(Icon, {
				icon: SvgPlus,
				colorScheme: "neutral",
				"aria-hidden": true
			}), /* @__PURE__ */ jsx(Span, { localizationKey: localizationKeys("billing.seeAllFeatures") })]
		})]
	});
});
const CardFeaturesListSeatCost = ({ plan }) => {
	const { t, $ } = useLocalizations();
	const unitPrices = plan.unitPrices;
	const period = t(localizationKeys("billing.month"));
	const periodAbbreviation = t(localizationKeys("billing.monthAbbreviation"));
	const seatRows = React$1.useMemo(() => {
		if (!unitPrices) return null;
		const seatUnitPrice = getSeatUnitPrice(plan);
		if (!seatUnitPrice) return null;
		const formatTierFee = (tier) => $(tier.feePerBlock, { style: "short" });
		const getCapacityText = (endsAfterBlock) => endsAfterBlock === null ? localizationKeys("billing.pricingTable.seatCost.unlimitedSeats") : localizationKeys("billing.pricingTable.seatCost.upToSeats", { endsAfterBlock });
		if (seatUnitPrice.tiers.length === 1) {
			const tier = seatUnitPrice.tiers[0];
			const rows = [];
			if (tier.feePerBlock.amount !== 0 && plan.hasBaseFee) rows.push({
				elementId: "seats",
				icon: SvgUserCircle,
				text: localizationKeys("billing.pricingTable.seatCost.perSeat", {
					feePerBlockAmount: formatTierFee(tier),
					periodAbbreviation
				})
			});
			rows.push({
				elementId: rows.length ? "seats-limit" : "seats",
				icon: SvgUsers,
				text: getCapacityText(tier.endsAfterBlock)
			});
			return rows;
		}
		if (seatUnitPrice.tiers.length === 2) {
			const [includedTier, additionalTier] = seatUnitPrice.tiers;
			if (includedTier && additionalTier && includedTier.feePerBlock.amount === 0 && includedTier.endsAfterBlock !== null && additionalTier.feePerBlock.amount !== 0) {
				const additionalTierFeePerBlockAmount = formatTierFee(additionalTier);
				const tooltipPrefixText = t(localizationKeys(plan.isDefault && (plan.fee?.amount === 0 || plan.annualMonthlyFee?.amount === 0) ? "billing.pricingTable.seatCost.tooltip.freeForUpToSeats" : "billing.pricingTable.seatCost.tooltip.firstSeatsIncludedInPlan", { endsAfterBlock: includedTier.endsAfterBlock }));
				const tooltipAdditionalText = t(localizationKeys("billing.pricingTable.seatCost.tooltip.additionalSeatsEach", {
					feePerBlockAmount: additionalTierFeePerBlockAmount,
					period
				}));
				return [{
					elementId: "seats",
					icon: SvgUserCircle,
					text: localizationKeys("billing.pricingTable.seatCost.includedSeats", { includedSeats: includedTier.endsAfterBlock }),
					additionalText: localizationKeys("billing.pricingTable.seatCost.additionalSeats", {
						additionalTierFeePerBlockAmount,
						periodAbbreviation
					}),
					additionalTooltipText: `${tooltipPrefixText} ${tooltipAdditionalText}`
				}, {
					elementId: "seats-limit",
					icon: SvgUsers,
					text: getCapacityText(additionalTier.endsAfterBlock)
				}];
			}
		}
		return null;
	}, [
		period,
		periodAbbreviation,
		plan.fee,
		plan.annualMonthlyFee,
		t,
		unitPrices,
		$
	]);
	if (!seatRows?.length) return null;
	return /* @__PURE__ */ jsx(Fragment$1, { children: seatRows.map((row) => /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.pricingTableCardFeaturesListItem,
		elementId: descriptors.pricingTableCardFeaturesListItem.setId(row.elementId),
		as: "li",
		sx: (t) => ({
			display: "flex",
			alignItems: "baseline",
			gap: t.space.$2,
			margin: 0,
			padding: 0
		}),
		children: [/* @__PURE__ */ jsx(Icon, {
			icon: row.icon,
			colorScheme: "neutral",
			"aria-hidden": true,
			sx: (t) => ({ transform: `translateY(${t.space.$0x25})` })
		}), /* @__PURE__ */ jsx(Span, {
			elementDescriptor: descriptors.pricingTableCardFeaturesListItemContent,
			children: /* @__PURE__ */ jsxs(Text, {
				elementDescriptor: descriptors.pricingTableCardFeaturesListItemTitle,
				colorScheme: "body",
				sx: (t) => ({ fontWeight: t.fontWeights.$normal }),
				children: [/* @__PURE__ */ jsx(Span, { localizationKey: row.text }), row.additionalText ? /* @__PURE__ */ jsxs(Fragment$1, { children: [" ", row.additionalTooltipText ? /* @__PURE__ */ jsxs(Tooltip.Root, { children: [/* @__PURE__ */ jsx(Tooltip.Trigger, { children: /* @__PURE__ */ jsx(Span, {
					localizationKey: row.additionalText,
					sx: { textDecoration: "underline dotted" }
				}) }), /* @__PURE__ */ jsx(Tooltip.Content, { text: row.additionalTooltipText })] }) : /* @__PURE__ */ jsx(Span, { localizationKey: row.additionalText })] }) : null]
			})
		})]
	}, row.elementId)) });
};

//#endregion
export { PricingTableDefault };
//# sourceMappingURL=PricingTableDefault.js.map