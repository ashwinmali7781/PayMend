import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgArrowUpDown from "../../icons/arrow-up-down.js";
import SvgCog from "../../icons/cog.js";
import SvgFiles from "../../icons/files.js";
import SvgPlus from "../../icons/plus.js";
import SvgUsers from "../../icons/users.js";
import { useProtect } from "../../common/Gate.js";
import { getSeatLimitAndIncludedSeatsLocalizationKey } from "../../utils/billingPlanSeats.js";
import { useSubscriberTypeContext, useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { usePlansContext, useSubscription } from "../../contexts/components/Plans.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { common } from "../../styledSystem/common.js";
import { Box, Col, Flex, Icon, Span, Table, Tbody, Td, Text, Th, Thead, Tr } from "../../customizables/index.js";
import { ProfileSection } from "../../elements/Section.js";
import { getBillingPeriodLabel, getDiscountDescription, toNegativeAmount } from "../../utils/billing.js";
import { SubscriptionBadge } from "./badge.js";
import { FullHeightLoader } from "../../elements/FullHeightLoader.js";
import { isManageableSubscriptionItem } from "../../utils/billingSubscription.js";
import { Fragment, useMemo } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Subscriptions/SubscriptionsList.tsx
function SubscriptionsList({ title, switchPlansLabel, newSubscriptionLabel, manageSubscriptionLabel }) {
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const subscriberType = useSubscriberTypeContext();
	const { subscriptionItems, data: subscription, isLoading } = useSubscription();
	const canManageBilling = useProtect((has) => has({ permission: "org:sys_billing:manage" })) || subscriberType === "user";
	const { navigate } = useRouter();
	const { commerceSettings } = useEnvironment();
	const { openSubscriptionDetails } = usePlansContext();
	const billingPlansExist = commerceSettings.billing.user.hasPaidPlans && subscriberType === "user" || commerceSettings.billing.organization.hasPaidPlans && subscriberType === "organization";
	const hasManageableSubscription = useMemo(() => subscriptionItems.some(isManageableSubscriptionItem), [subscriptionItems]);
	const isManageButtonVisible = canManageBilling && hasManageableSubscription;
	const sortedSubscriptionItems = useMemo(() => subscriptionItems.sort((a, b) => {
		if (a.status === "active" && b.status !== "active") return -1;
		if (b.status === "active" && a.status !== "active") return 1;
		return 1;
	}), [subscriptionItems]);
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		id: "subscriptionsList",
		title,
		centered: false,
		sx: (t) => ({
			borderTop: "none",
			paddingTop: t.space.$1
		}),
		children: isLoading && subscriptionItems.length === 0 ? /* @__PURE__ */ jsx(Box, {
			sx: (t) => ({ height: `calc(${t.space.$1} * 10.5 + ${t.space.$2} + ${t.space.$8})` }),
			children: /* @__PURE__ */ jsx(FullHeightLoader, {})
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [subscriptionItems.length > 0 && /* @__PURE__ */ jsxs(Table, {
			sx: (t) => ({
				overflow: "hidden",
				"tr > td": {
					paddingTop: t.space.$3,
					paddingBottom: t.space.$3,
					paddingInlineStart: t.space.$3,
					paddingInlineEnd: t.space.$3
				}
			}),
			tableHeadVisuallyHidden: true,
			children: [/* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [/* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys(`${localizationRoot}.billingPage.subscriptionsListSection.tableHeader__plan`) }), /* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys(`${localizationRoot}.billingPage.subscriptionsListSection.tableHeader__startDate`) })] }) }), /* @__PURE__ */ jsxs(Tbody, { children: [sortedSubscriptionItems.map((subscriptionItem) => /* @__PURE__ */ jsx(SubscriptionItemRow, {
				subscriptionItem,
				length: sortedSubscriptionItems.length
			}, subscriptionItem.id)), subscription?.nextPayment ? /* @__PURE__ */ jsx(SubscriptionOverviewRow, {
				nextPayment: subscription.nextPayment,
				localizationRoot
			}) : null] })]
		}), /* @__PURE__ */ jsxs(ProfileSection.ButtonGroup, {
			id: "subscriptionsList",
			children: [billingPlansExist ? /* @__PURE__ */ jsx(ProfileSection.ArrowButton, {
				id: "subscriptionsList",
				textLocalizationKey: subscriptionItems.length > 0 ? switchPlansLabel : newSubscriptionLabel,
				sx: [(t) => ({
					justifyContent: "start",
					height: t.sizes.$8,
					width: isManageButtonVisible ? "unset" : void 0
				})],
				leftIcon: subscriptionItems.length > 0 ? SvgArrowUpDown : SvgPlus,
				rightIcon: null,
				leftIconSx: (t) => ({
					width: t.sizes.$4,
					height: t.sizes.$4
				}),
				onClick: () => void navigate("plans")
			}) : null, isManageButtonVisible ? /* @__PURE__ */ jsx(ProfileSection.ArrowButton, {
				id: "subscriptionsList",
				textLocalizationKey: manageSubscriptionLabel,
				sx: [(t) => ({
					justifyContent: "start",
					height: t.sizes.$8,
					width: "unset"
				})],
				rightIcon: null,
				leftIcon: SvgCog,
				leftIconSx: (t) => ({
					width: t.sizes.$4,
					height: t.sizes.$4
				}),
				onClick: (event) => openSubscriptionDetails(event)
			}) : null]
		})] })
	});
}
function SubscriptionOverviewRow({ nextPayment, localizationRoot }) {
	const { $ } = useLocalizations();
	if (!nextPayment.totals) return null;
	return /* @__PURE__ */ jsxs(Tr, {
		sx: (t) => ({ background: common.mutedBackground(t) }),
		children: [/* @__PURE__ */ jsx(Td, {
			sx: { verticalAlign: "top" },
			children: /* @__PURE__ */ jsx(Text, {
				variant: "subtitle",
				localizationKey: localizationKeys(`${localizationRoot}.billingPage.subscriptionsListSection.overview`)
			})
		}), /* @__PURE__ */ jsx(Td, {
			sx: { textAlign: "end" },
			children: /* @__PURE__ */ jsxs(Col, {
				gap: 1,
				align: "end",
				children: [/* @__PURE__ */ jsx(Text, {
					variant: "h2",
					sx: (t) => ({ color: t.colors.$colorForeground }),
					children: $(nextPayment.totals.grandTotal)
				}), /* @__PURE__ */ jsx(Text, {
					variant: "subtitle",
					colorScheme: "secondary",
					localizationKey: localizationKeys("badge__renewsAt", { date: nextPayment.date })
				})]
			})
		})]
	});
}
function SubscriptionDiscountRow({ subscriptionItem }) {
	const { $, t } = useLocalizations();
	const appliedDiscount = subscriptionItem.appliedDiscount;
	if (!appliedDiscount || appliedDiscount.status !== "active") return null;
	const totalCycles = appliedDiscount.cyclesRemaining === null ? null : appliedDiscount.cyclesApplied + appliedDiscount.cyclesRemaining;
	return /* @__PURE__ */ jsxs(Tr, {
		sx: (t) => subscriptionItem.status === "upcoming" ? { background: common.mutedBackground(t) } : {},
		children: [/* @__PURE__ */ jsx(Td, {
			sx: { verticalAlign: "top" },
			children: /* @__PURE__ */ jsxs(Col, {
				gap: 1,
				children: [/* @__PURE__ */ jsx(Text, {
					variant: "subtitle",
					children: `${appliedDiscount.name} (${getDiscountDescription(appliedDiscount, totalCycles, subscriptionItem.planPeriod, {
						$,
						t
					})})`
				}), appliedDiscount.cyclesRemaining !== null ? /* @__PURE__ */ jsx(Text, {
					variant: "subtitle",
					colorScheme: "secondary",
					localizationKey: localizationKeys("billing.discountCyclesRemaining", {
						cycles: appliedDiscount.cyclesRemaining,
						period: getBillingPeriodLabel(subscriptionItem.planPeriod, appliedDiscount.cyclesRemaining, t)
					})
				}) : null]
			})
		}), /* @__PURE__ */ jsx(Td, {
			sx: { textAlign: "end" },
			children: /* @__PURE__ */ jsx(Text, {
				variant: "subtitle",
				children: appliedDiscount.amount ? $(toNegativeAmount(appliedDiscount.amount)) : null
			})
		})]
	});
}
function SubscriptionItemRow({ subscriptionItem, length }) {
	const fee = subscriptionItem.planPeriod === "annual" ? subscriptionItem.plan.annualFee : subscriptionItem.plan.fee;
	const { captionForSubscription } = usePlansContext();
	const { t, $ } = useLocalizations();
	const subItemSeatsQty = subscriptionItem.seats?.quantity;
	const seatsTotalTier = subscriptionItem.seats?.tiers?.find((t) => t.total.amount > 0);
	const monthLabel = t(localizationKeys("billing.month")).toLowerCase();
	const seatLimitAndIncludedSeatsLocalizationKey = getSeatLimitAndIncludedSeatsLocalizationKey(subscriptionItem.plan);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(Tr, {
			sx: (t) => {
				if (subscriptionItem.status === "upcoming") return { background: common.mutedBackground(t) };
				return {};
			},
			children: [/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Col, {
				gap: 1,
				children: [/* @__PURE__ */ jsxs(Flex, {
					align: "center",
					gap: 1,
					children: [
						/* @__PURE__ */ jsx(Icon, {
							icon: SvgFiles,
							sx: (t) => ({
								width: t.sizes.$4,
								height: t.sizes.$4,
								opacity: t.opacity.$inactive,
								color: t.colors.$colorMutedForeground
							})
						}),
						/* @__PURE__ */ jsx(Text, {
							variant: "subtitle",
							sx: (t) => ({ marginInlineEnd: t.sizes.$1 }),
							children: subscriptionItem.plan.name
						}),
						subscriptionItem.isFreeTrial || length > 1 || !!subscriptionItem.canceledAt ? /* @__PURE__ */ jsx(SubscriptionBadge, { subscription: subscriptionItem.isFreeTrial ? { status: "free_trial" } : subscriptionItem }) : null
					]
				}), (!subscriptionItem.plan.isDefault || subscriptionItem.status === "upcoming") && /* @__PURE__ */ jsx(Text, {
					variant: "caption",
					colorScheme: "secondary",
					localizationKey: captionForSubscription(subscriptionItem)
				})]
			}) }), /* @__PURE__ */ jsx(Td, {
				sx: (_) => ({ textAlign: "end" }),
				children: /* @__PURE__ */ jsxs(Text, {
					variant: "subtitle",
					children: [$(fee, { style: "short" }), fee.amount > 0 && /* @__PURE__ */ jsx(Span, {
						sx: (t) => ({
							color: t.colors.$colorMutedForeground,
							textTransform: "lowercase",
							":before": {
								content: "\"/\"",
								marginInline: t.space.$1
							}
						}),
						localizationKey: subscriptionItem.planPeriod === "annual" ? localizationKeys("billing.year") : localizationKeys("billing.month")
					})]
				})
			})]
		}),
		typeof subItemSeatsQty !== "undefined" ? /* @__PURE__ */ jsxs(Tr, {
			sx: (t) => {
				if (subscriptionItem.status === "upcoming") return { background: common.mutedBackground(t) };
				return {};
			},
			children: [/* @__PURE__ */ jsx(Td, {
				sx: { verticalAlign: "top" },
				children: /* @__PURE__ */ jsx(Col, {
					gap: 1,
					children: /* @__PURE__ */ jsxs(Flex, {
						align: "center",
						gap: 1,
						children: [/* @__PURE__ */ jsx(Icon, {
							icon: SvgUsers,
							sx: (t) => ({
								width: t.sizes.$4,
								height: t.sizes.$4,
								opacity: t.opacity.$inactive,
								color: t.colors.$colorMutedForeground
							})
						}), /* @__PURE__ */ jsx(Text, {
							variant: "subtitle",
							sx: (t) => ({ marginInlineEnd: t.sizes.$1 }),
							localizationKey: localizationKeys("billing.seats")
						})]
					})
				})
			}), /* @__PURE__ */ jsx(Td, {
				sx: (_) => ({ textAlign: "end" }),
				children: /* @__PURE__ */ jsxs(Col, {
					gap: 1,
					align: "end",
					children: [seatLimitAndIncludedSeatsLocalizationKey ? /* @__PURE__ */ jsx(Text, {
						variant: "subtitle",
						localizationKey: seatLimitAndIncludedSeatsLocalizationKey
					}) : null, seatsTotalTier && seatsTotalTier.quantity ? /* @__PURE__ */ jsx(Text, {
						variant: "subtitle",
						children: t(localizationKeys("organizationProfile.billingPage.subscriptionsListSection.paidSeatsUsage", {
							seatsQuantity: seatsTotalTier.quantity,
							amount: `${$(seatsTotalTier.feePerBlock)} / ${monthLabel}`
						}))
					}) : null]
				})
			})]
		}) : null,
		/* @__PURE__ */ jsx(SubscriptionDiscountRow, { subscriptionItem })
	] }, subscriptionItem.id);
}

//#endregion
export { SubscriptionsList };
//# sourceMappingURL=SubscriptionsList.js.map