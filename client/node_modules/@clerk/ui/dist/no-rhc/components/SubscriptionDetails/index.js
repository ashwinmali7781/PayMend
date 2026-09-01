import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgUsers from "../../icons/users.js";
import { useProtect } from "../../common/Gate.js";
import { getSeatLimitAndIncludedSeatsLocalizationKey } from "../../utils/billingPlanSeats.js";
import { SubscriberTypeContext, useSubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { usePlansContext, useSubscription } from "../../contexts/components/Plans.js";
import { SubscriptionDetailsContext, useSubscriptionDetailsContext } from "../../contexts/components/SubscriptionDetails.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Button, Col, Flex, Heading, Icon, Spinner, Text } from "../../customizables/index.js";
import { CardAlert } from "../../elements/Card/CardAlert.js";
import { handleError } from "../../utils/errorHandler.js";
import { Drawer, useDrawerContext } from "../../elements/Drawer.js";
import { LineItems } from "../../elements/LineItems.js";
import { formatDate } from "../../utils/formatDate.js";
import { SubscriptionBadge } from "../Subscriptions/badge.js";
import { Avatar } from "../../elements/Avatar.js";
import { isManageableSubscriptionItem } from "../../utils/billingSubscription.js";
import * as React$1 from "react";
import { useCallback, useContext, useState } from "react";
import { __internal_useOrganizationBase, useClerk } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SubscriptionDetails/index.tsx
const SubscriptionForCancellationContext = React$1.createContext({
	confirmationOpen: false,
	setConfirmationOpen: () => {},
	subscription: null,
	setSubscription: () => {}
});
const SubscriptionDetails = (props) => {
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "subscriptionDetails",
		children: /* @__PURE__ */ jsx(Flow.Part, { children: /* @__PURE__ */ jsx(Drawer.Content, { children: /* @__PURE__ */ jsx(SubscriptionDetailsContext.Provider, {
			value: {
				componentName: "SubscriptionDetails",
				...props
			},
			children: /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
				value: props.for,
				children: /* @__PURE__ */ jsx(SubscriptionDetailsInternal, { ...props })
			})
		}) }) })
	});
};
function useGuessableSubscription(options) {
	const { subscriptionItems, isLoading } = useSubscription();
	const activeSubscription = subscriptionItems?.find((sub) => sub.status === "active");
	const upcomingSubscription = subscriptionItems?.find((sub) => sub.status === "upcoming");
	const pastDueSubscription = subscriptionItems?.find((sub) => sub.status === "past_due");
	if (options?.or === "throw" && !activeSubscription && !pastDueSubscription) throw new Error("No active or past due subscription found");
	return {
		upcomingSubscription,
		pastDueSubscription,
		activeSubscription,
		anySubscription: upcomingSubscription || activeSubscription || pastDueSubscription,
		isLoading
	};
}
const SubscriptionDetailsInternal = (props) => {
	const [subscriptionForCancellation, setSubscriptionForCancellation] = useState(null);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const { subscriptionItems, isLoading } = useSubscription();
	const { activeSubscription, pastDueSubscription } = useGuessableSubscription();
	if (isLoading) return /* @__PURE__ */ jsx(Spinner, { sx: { margin: "auto" } });
	if (!activeSubscription && !pastDueSubscription) return null;
	return /* @__PURE__ */ jsxs(SubscriptionForCancellationContext.Provider, {
		value: {
			subscription: subscriptionForCancellation,
			setSubscription: setSubscriptionForCancellation,
			confirmationOpen,
			setConfirmationOpen
		},
		children: [
			/* @__PURE__ */ jsx(Drawer.Header, { title: localizationKeys("billing.subscriptionDetails.title") }),
			/* @__PURE__ */ jsx(Drawer.Body, {
				sx: (t) => ({
					display: "flex",
					flexDirection: "column",
					flex: 1,
					overflowY: "auto",
					padding: t.space.$4,
					gap: t.space.$4
				}),
				children: subscriptionItems?.map((subscriptionItem) => /* @__PURE__ */ jsx(SubscriptionCard, {
					subscription: subscriptionItem,
					...props
				}, subscriptionItem.id))
			}),
			/* @__PURE__ */ jsx(SubscriptionDetailsFooter, {})
		]
	});
};
const SubscriptionDetailsFooter = withCardStateProvider(() => {
	const subscriberType = useSubscriberTypeContext();
	const { isLoading, error, setError, setLoading, setIdle } = useCardState();
	const { subscription: selectedSubscription, confirmationOpen, setConfirmationOpen } = useContext(SubscriptionForCancellationContext);
	const { data: subscription } = useSubscription();
	const { setIsOpen } = useDrawerContext();
	const { onSubscriptionCancel } = useSubscriptionDetailsContext();
	const organization = __internal_useOrganizationBase();
	const onOpenChange = useCallback((open) => setConfirmationOpen(open), [setConfirmationOpen]);
	const cancelSubscription = useCallback(async () => {
		if (!selectedSubscription) return;
		setError(void 0);
		setLoading();
		await selectedSubscription.cancel({ orgId: subscriberType === "organization" ? organization?.id : void 0 }).then(() => {
			onSubscriptionCancel?.();
			if (setIsOpen) setIsOpen(false);
		}).catch((error) => {
			handleError(error, [], setError);
		}).finally(() => {
			setIdle();
		});
	}, [
		selectedSubscription,
		setError,
		setLoading,
		subscriberType,
		organization?.id,
		onSubscriptionCancel,
		setIsOpen,
		setIdle
	]);
	if (!subscription?.nextPayment) return null;
	return /* @__PURE__ */ jsxs(Drawer.Footer, { children: [/* @__PURE__ */ jsx(SubscriptionDetailsSummary, {}), /* @__PURE__ */ jsx(Drawer.Confirmation, {
		open: confirmationOpen,
		onOpenChange,
		actionsSlot: /* @__PURE__ */ jsxs(Fragment$1, { children: [!isLoading && /* @__PURE__ */ jsx(Button, {
			variant: "ghost",
			size: "sm",
			textVariant: "buttonLarge",
			onClick: () => {
				setIdle();
				setError(void 0);
				onOpenChange(false);
			},
			localizationKey: selectedSubscription?.isFreeTrial ? localizationKeys("billing.keepFreeTrial") : localizationKeys("billing.keepSubscription")
		}), /* @__PURE__ */ jsx(Button, {
			variant: "solid",
			colorScheme: "danger",
			size: "sm",
			textVariant: "buttonLarge",
			isLoading,
			onClick: () => void cancelSubscription(),
			localizationKey: selectedSubscription?.isFreeTrial ? localizationKeys("billing.cancelFreeTrial", { plan: selectedSubscription.plan.name }) : localizationKeys("billing.cancelSubscription")
		})] }),
		children: selectedSubscription ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
			/* @__PURE__ */ jsx(Heading, {
				elementDescriptor: descriptors.drawerConfirmationTitle,
				as: "h2",
				textVariant: "h3",
				localizationKey: selectedSubscription?.isFreeTrial ? localizationKeys("billing.cancelFreeTrialTitle", { plan: selectedSubscription.plan.name }) : localizationKeys("billing.cancelSubscriptionTitle", { plan: `${selectedSubscription.status === "upcoming" ? "upcoming " : ""}${selectedSubscription.plan.name}` })
			}),
			/* @__PURE__ */ jsx(Text, {
				elementDescriptor: descriptors.drawerConfirmationDescription,
				colorScheme: "secondary",
				localizationKey: selectedSubscription?.isFreeTrial ? localizationKeys("billing.cancelFreeTrialAccessUntil", {
					plan: selectedSubscription.plan.name,
					date: selectedSubscription.periodEnd
				}) : selectedSubscription.status === "upcoming" ? localizationKeys("billing.cancelSubscriptionNoCharge") : selectedSubscription.status === "past_due" ? localizationKeys("billing.cancelSubscriptionPastDue") : localizationKeys("billing.cancelSubscriptionAccessUntil", {
					plan: selectedSubscription.plan.name,
					date: selectedSubscription.periodEnd
				})
			}),
			/* @__PURE__ */ jsx(CardAlert, { children: error })
		] }) : null
	})] });
});
function SubscriptionDetailsSummary() {
	const { activeSubscription } = useGuessableSubscription({ or: "throw" });
	const { data: subscription } = useSubscription();
	const { $ } = useLocalizations();
	if (!subscription?.nextPayment || !activeSubscription) return null;
	const { isFreeTrial } = activeSubscription;
	return /* @__PURE__ */ jsxs(LineItems.Root, { children: [
		/* @__PURE__ */ jsxs(LineItems.Group, { children: [/* @__PURE__ */ jsx(LineItems.Title, { description: localizationKeys("billing.subscriptionDetails.currentBillingCycle") }), /* @__PURE__ */ jsx(LineItems.Description, { text: activeSubscription.planPeriod === "month" ? localizationKeys("billing.monthly") : localizationKeys("billing.annually") })] }),
		/* @__PURE__ */ jsxs(LineItems.Group, { children: [/* @__PURE__ */ jsx(LineItems.Title, { description: localizationKeys(`billing.subscriptionDetails.${isFreeTrial ? "firstPaymentOn" : "nextPaymentOn"}`) }), /* @__PURE__ */ jsx(LineItems.Description, { text: formatDate(subscription.nextPayment.date) })] }),
		/* @__PURE__ */ jsxs(LineItems.Group, { children: [/* @__PURE__ */ jsx(LineItems.Title, { description: localizationKeys(`billing.subscriptionDetails.${isFreeTrial ? "firstPaymentAmount" : "nextPaymentAmount"}`) }), /* @__PURE__ */ jsx(LineItems.Description, {
			prefix: subscription.nextPayment.amount.currency,
			text: $(subscription.nextPayment.amount)
		})] })
	] });
}
const SubscriptionCardActions = ({ subscription }) => {
	const { portalRoot } = useSubscriptionDetailsContext();
	const { __internal_openCheckout } = useClerk();
	const subscriberType = useSubscriberTypeContext();
	const { setIsOpen } = useDrawerContext();
	const { revalidateAll } = usePlansContext();
	const { setSubscription, setConfirmationOpen } = useContext(SubscriptionForCancellationContext);
	const { $ } = useLocalizations();
	const canOrgManageBilling = useProtect((has) => has({ permission: "org:sys_billing:manage" }));
	const canManageBilling = subscriberType === "user" || canOrgManageBilling;
	const isManageable = isManageableSubscriptionItem(subscription);
	const isSwitchable = (subscription.planPeriod === "month" && Boolean(subscription.plan.annualMonthlyFee) || subscription.planPeriod === "annual" && Boolean(subscription.plan.fee)) && subscription.status !== "past_due" && isManageable;
	const isCancellable = subscription.canceledAt === null && isManageable;
	const isReSubscribable = subscription.canceledAt !== null && isManageable;
	const openCheckout = useCallback((params) => {
		if (setIsOpen) setIsOpen(false);
		__internal_openCheckout({
			...params,
			onSubscriptionComplete: () => {
				revalidateAll();
			},
			portalRoot
		});
	}, [
		__internal_openCheckout,
		revalidateAll,
		portalRoot,
		setIsOpen
	]);
	const actions = React$1.useMemo(() => {
		if (!canManageBilling) return [];
		return [
			isSwitchable ? {
				label: subscription.planPeriod === "month" ? localizationKeys("billing.switchToAnnualWithAnnualPrice", { price: $(subscription.plan.annualFee, { style: "short" }) }) : localizationKeys("billing.switchToMonthlyWithPrice", { price: $(subscription.plan.fee, { style: "short" }) }),
				onClick: () => {
					openCheckout({
						planId: subscription.plan.id,
						planPeriod: subscription.planPeriod === "month" ? "annual" : "month",
						for: subscriberType
					});
				}
			} : null,
			isCancellable ? {
				isDestructive: true,
				label: subscription.isFreeTrial ? localizationKeys("billing.cancelFreeTrial", { plan: subscription.plan.name }) : localizationKeys("billing.cancelSubscription"),
				onClick: () => {
					setSubscription(subscription);
					setConfirmationOpen(true);
				}
			} : null,
			isReSubscribable ? {
				label: localizationKeys("billing.reSubscribe"),
				onClick: () => {
					openCheckout({
						planId: subscription.plan.id,
						planPeriod: subscription.planPeriod,
						for: subscriberType
					});
				}
			} : null
		].filter((a) => a !== null);
	}, [
		isSwitchable,
		subscription,
		isCancellable,
		openCheckout,
		subscriberType,
		setSubscription,
		canManageBilling,
		isReSubscribable,
		setConfirmationOpen,
		$
	]);
	if (actions.length === 0) return null;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.subscriptionDetailsCardActions,
		gap: 2,
		sx: (t) => ({
			paddingInline: t.space.$3,
			paddingBlock: t.space.$3,
			borderBlockStartWidth: t.borderWidths.$normal,
			borderBlockStartStyle: t.borderStyles.$solid,
			borderBlockStartColor: t.colors.$borderAlpha100
		}),
		children: actions.map((action, index) => /* @__PURE__ */ jsx(Button, {
			elementDescriptor: action.isDestructive ? descriptors.subscriptionDetailsCancelButton : descriptors.subscriptionDetailsActionButton,
			variant: action.isDestructive ? "ghost" : "outline",
			colorScheme: action.isDestructive ? "danger" : void 0,
			size: "xs",
			textVariant: "buttonSmall",
			onClick: action.onClick,
			localizationKey: action.label
		}, index))
	});
};
const SubscriptionCard = ({ subscription }) => {
	const { t, $ } = useLocalizations();
	const subItemSeatsQty = subscription.seats?.quantity;
	const firstPaidSeatTier = subscription.seats?.tiers?.find((tier) => tier.total.amount > 0);
	const monthLabel = t(localizationKeys("billing.month")).toLowerCase();
	const seatLimitAndIncludedSeatsLocalizationKey = getSeatLimitAndIncludedSeatsLocalizationKey(subscription.plan);
	const fee = subscription.planPeriod === "month" ? subscription.plan.fee : subscription.plan.annualFee;
	return /* @__PURE__ */ jsxs(Col, {
		elementDescriptor: descriptors.subscriptionDetailsCard,
		sx: (t) => ({
			borderRadius: t.radii.$md,
			boxShadow: t.shadows.$tableBodyShadow,
			overflow: "hidden"
		}),
		children: [
			/* @__PURE__ */ jsx(Col, {
				elementDescriptor: descriptors.subscriptionDetailsCardBody,
				gap: 3,
				sx: (t) => ({
					padding: t.space.$3,
					background: common.mutedBackground(t)
				}),
				children: /* @__PURE__ */ jsxs(Flex, {
					elementDescriptor: descriptors.subscriptionDetailsCardHeader,
					justify: "between",
					gap: 2,
					children: [
						subscription.plan.avatarUrl ? /* @__PURE__ */ jsx(Avatar, {
							boxElementDescriptor: descriptors.planDetailAvatar,
							size: (_) => 40,
							title: subscription.plan.name,
							rounded: false,
							imageUrl: subscription.plan.avatarUrl
						}) : null,
						/* @__PURE__ */ jsxs(Flex, {
							direction: "col",
							justify: "between",
							children: [/* @__PURE__ */ jsx(Text, {
								elementDescriptor: descriptors.subscriptionDetailsCardTitle,
								variant: "h2",
								sx: (t) => ({
									fontSize: t.fontSizes.$lg,
									fontWeight: t.fontWeights.$semibold,
									color: t.colors.$colorForeground
								}),
								children: subscription.plan.name
							}), /* @__PURE__ */ jsxs(Flex, { children: [/* @__PURE__ */ jsx(Text, {
								variant: "body",
								as: "span",
								sx: (t) => ({
									fontWeight: t.fontWeights.$medium,
									textTransform: "lowercase"
								}),
								children: $(fee)
							}), /* @__PURE__ */ jsx(Text, {
								variant: "body",
								as: "span",
								colorScheme: "secondary",
								sx: (t) => ({
									fontWeight: t.fontWeights.$medium,
									textTransform: "lowercase",
									whiteSpace: "pre"
								}),
								children: ` / ${t(localizationKeys(`billing.${subscription.planPeriod === "month" ? "month" : "year"}`))}`
							})] })]
						}),
						/* @__PURE__ */ jsx(Flex, {
							align: "start",
							children: /* @__PURE__ */ jsx(SubscriptionBadge, {
								subscription: subscription.isFreeTrial ? { status: "free_trial" } : subscription,
								elementDescriptor: descriptors.subscriptionDetailsCardBadge
							})
						})
					]
				})
			}),
			typeof subItemSeatsQty !== "undefined" ? /* @__PURE__ */ jsx(DetailRow, {
				variant: "header",
				labelNode: /* @__PURE__ */ jsxs(Flex, {
					align: "center",
					gap: 1,
					children: [/* @__PURE__ */ jsx(Icon, {
						icon: SvgUsers,
						size: "md",
						colorScheme: "neutral"
					}), /* @__PURE__ */ jsx(Text, { localizationKey: localizationKeys("billing.seats") })]
				}),
				valueNode: /* @__PURE__ */ jsxs(Col, {
					gap: 1,
					align: "end",
					children: [seatLimitAndIncludedSeatsLocalizationKey ? /* @__PURE__ */ jsx(Text, {
						variant: "subtitle",
						localizationKey: seatLimitAndIncludedSeatsLocalizationKey
					}) : null, firstPaidSeatTier && firstPaidSeatTier.quantity ? /* @__PURE__ */ jsx(Text, {
						variant: "subtitle",
						children: t(localizationKeys("organizationProfile.billingPage.subscriptionsListSection.paidSeatsUsage", {
							seatsQuantity: firstPaidSeatTier.quantity,
							amount: `${$(firstPaidSeatTier.feePerBlock)} / ${monthLabel}`
						}))
					}) : null]
				})
			}) : null,
			subscription.pastDueAt ? /* @__PURE__ */ jsx(DetailRow, {
				label: localizationKeys("billing.subscriptionDetails.pastDueAt"),
				value: formatDate(subscription.pastDueAt)
			}) : null,
			subscription.status === "active" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(DetailRow, {
				label: subscription.isFreeTrial ? localizationKeys("billing.subscriptionDetails.trialStartedOn") : localizationKeys("billing.subscriptionDetails.subscribedOn"),
				value: formatDate(subscription.createdAt)
			}), subscription.periodEnd && /* @__PURE__ */ jsx(DetailRow, {
				label: subscription.canceledAt ? localizationKeys("billing.subscriptionDetails.endsOn") : subscription.isFreeTrial ? localizationKeys("billing.subscriptionDetails.trialEndsOn") : localizationKeys("billing.subscriptionDetails.renewsAt"),
				value: formatDate(subscription.periodEnd)
			})] }) : null,
			subscription.status === "upcoming" ? /* @__PURE__ */ jsx(DetailRow, {
				label: localizationKeys("billing.subscriptionDetails.beginsOn"),
				value: formatDate(subscription.periodStart)
			}) : null,
			/* @__PURE__ */ jsx(SubscriptionCardActions, { subscription })
		]
	});
};
const DetailRow = ({ label, labelNode, value, valueNode, variant }) => /* @__PURE__ */ jsxs(Flex, {
	elementDescriptor: descriptors.subscriptionDetailsDetailRow,
	justify: "between",
	align: valueNode ? "start" : "center",
	sx: (t) => ({
		paddingInline: t.space.$3,
		paddingBlock: t.space.$3,
		borderBlockStartWidth: t.borderWidths.$normal,
		borderBlockStartStyle: t.borderStyles.$solid,
		borderBlockStartColor: t.colors.$borderAlpha100,
		...variant === "header" ? { background: common.mutedBackground(t) } : {}
	}),
	children: [
		label ? /* @__PURE__ */ jsx(Text, {
			elementDescriptor: descriptors.subscriptionDetailsDetailRowLabel,
			localizationKey: label
		}) : null,
		labelNode ? labelNode : null,
		valueNode ? valueNode : typeof value === "string" ? /* @__PURE__ */ jsx(Text, {
			elementDescriptor: descriptors.subscriptionDetailsDetailRowValue,
			colorScheme: "secondary",
			children: value
		}) : value ? /* @__PURE__ */ jsx(Text, {
			localizationKey: value,
			elementDescriptor: descriptors.subscriptionDetailsDetailRowValue,
			colorScheme: "secondary"
		}) : null
	]
});

//#endregion
export { SubscriptionDetails };
//# sourceMappingURL=index.js.map