import { localizationKeys } from "../../localization/localizationKeys.js";
import { useProtect } from "../../common/Gate.js";
import { organizationExceedsPlanSeatLimit } from "../../utils/billingPlanSeats.js";
import { getClosestProfileScrollBox } from "../../utils/getClosestProfileScrollBox.js";
import { useSubscriberTypeContext } from "./SubscriberType.js";
import { useCallback, useMemo } from "react";
import { __experimental_usePaymentAttempts, __experimental_usePaymentMethods, __experimental_usePlans, __experimental_useStatements, __experimental_useSubscription, __internal_useCreditBalanceQuery, __internal_useCreditHistoryQuery, __internal_useOrganizationBase, useClerk, useSession } from "@clerk/shared/react";

//#region src/contexts/components/Plans.tsx
const useBillingHookParams = () => {
	const subscriberType = useSubscriberTypeContext();
	const allowBillingRoutes = useProtect((has) => has({ permission: "org:sys_billing:read" }) || has({ permission: "org:sys_billing:manage" }));
	const organization = __internal_useOrganizationBase();
	return {
		for: subscriberType,
		keepPreviousData: true,
		enabled: subscriberType === "organization" ? Boolean(organization) && allowBillingRoutes : true
	};
};
const usePaymentMethods = () => {
	return __experimental_usePaymentMethods(useBillingHookParams());
};
const usePaymentAttempts = () => {
	return __experimental_usePaymentAttempts(useBillingHookParams());
};
const useStatements = (externalParams) => {
	return __experimental_useStatements({
		...useBillingHookParams(),
		__experimental_mode: externalParams?.mode
	});
};
const useSubscription = () => {
	const subscription = __experimental_useSubscription(useBillingHookParams());
	const subscriptionItems = useMemo(() => subscription.data?.subscriptionItems || [], [subscription.data?.subscriptionItems]);
	return {
		...subscription,
		subscriptionItems
	};
};
const usePlans = (params) => {
	return __experimental_usePlans({
		for: useSubscriberTypeContext(),
		initialPage: 1,
		pageSize: 50,
		keepPreviousData: true,
		enabled: true,
		__experimental_mode: params?.mode
	});
};
const useCreditBalance = () => {
	return __internal_useCreditBalanceQuery(useBillingHookParams());
};
const useCreditHistory = () => {
	return __internal_useCreditHistoryQuery(useBillingHookParams());
};
const usePlansContext = () => {
	const clerk = useClerk();
	const { session } = useSession();
	const subscriberType = useSubscriberTypeContext();
	const canManageBilling = useMemo(() => {
		if (!clerk.session) return true;
		if (clerk?.session?.checkAuthorization({ permission: "org:sys_billing:manage" }) || subscriberType === "user") return true;
		return false;
	}, [clerk, subscriberType]);
	const { subscriptionItems, revalidate: revalidateSubscriptions, data: topLevelSubscription } = useSubscription();
	const { data: plans, revalidate: revalidatePlans } = usePlans({ mode: "cache" });
	const { revalidate: revalidateStatements } = useStatements({ mode: "cache" });
	const { revalidate: revalidatePaymentMethods } = usePaymentMethods();
	const revalidateAll = useCallback(() => {
		revalidateSubscriptions();
		revalidatePlans();
		revalidateStatements();
		revalidatePaymentMethods();
	}, [
		revalidateSubscriptions,
		revalidatePlans,
		revalidateStatements,
		revalidatePaymentMethods
	]);
	const isDefaultPlanImplicitlyActiveOrUpcoming = useMemo(() => {
		return subscriptionItems.length === 0 || !subscriptionItems.some((subscription) => !subscription.canceledAt);
	}, [subscriptionItems]);
	const activeOrUpcomingSubscription = useCallback((plan) => {
		return subscriptionItems.find((subscription) => subscription.plan.id === plan.id);
	}, [subscriptionItems]);
	const activeAndUpcomingSubscriptions = useCallback((plan) => {
		return subscriptionItems.filter((subscription) => subscription.plan.id === plan.id);
	}, [subscriptionItems]);
	const activeOrUpcomingSubscriptionWithPlanPeriod = useCallback((plan, planPeriod = "month") => {
		const plansSubscriptions = activeAndUpcomingSubscriptions(plan);
		if (plansSubscriptions.length > 1) {
			const subscriptionBaseOnPanPeriod = plansSubscriptions.find((subscription) => {
				return subscription.planPeriod === planPeriod;
			});
			if (subscriptionBaseOnPanPeriod) return subscriptionBaseOnPanPeriod;
			return plansSubscriptions[0];
		}
		if (plansSubscriptions.length === 1) return plansSubscriptions[0];
	}, [activeAndUpcomingSubscriptions]);
	const canManageSubscription = useCallback(({ plan, subscription: sub }) => {
		const subscription = sub ?? (plan ? activeOrUpcomingSubscription(plan) : void 0);
		return !subscription || !subscription.canceledAt;
	}, [activeOrUpcomingSubscription]);
	const buttonPropsForPlan = useCallback(({ plan, organization, subscription: sub, isCompact = false, selectedPlanPeriod = "annual" }) => {
		const subscription = sub ?? (plan ? activeOrUpcomingSubscriptionWithPlanPeriod(plan, selectedPlanPeriod) : void 0);
		const exceedsPlanSeatLimit = subscriberType === "organization" && !!organization && organizationExceedsPlanSeatLimit(plan, organization);
		let _selectedPlanPeriod = selectedPlanPeriod;
		const isEligibleForSwitchToAnnual = Boolean(plan?.annualMonthlyFee);
		if (_selectedPlanPeriod === "annual" && !isEligibleForSwitchToAnnual) _selectedPlanPeriod = "month";
		const freeTrialOr = (localizationKey) => {
			if (plan?.freeTrialEnabled) {
				const isSignedOut = !session;
				const isEligibleForTrial = topLevelSubscription?.eligibleForFreeTrial;
				if (isSignedOut || isEligibleForTrial) return localizationKeys("billing.startFreeTrial__days", { days: plan.freeTrialDays ?? 0 });
			}
			return localizationKey;
		};
		const getLocalizationKey = () => {
			if (subscription) {
				if (_selectedPlanPeriod !== subscription.planPeriod && subscription.canceledAt) {
					if (_selectedPlanPeriod === "month") return localizationKeys("billing.switchToMonthly");
					if (isEligibleForSwitchToAnnual) return localizationKeys("billing.switchToAnnual");
				}
				if (subscription.canceledAt) return localizationKeys("billing.reSubscribe");
				if (_selectedPlanPeriod !== subscription.planPeriod) {
					if (_selectedPlanPeriod === "month") return localizationKeys("billing.switchToMonthly");
					if (isEligibleForSwitchToAnnual) return localizationKeys("billing.switchToAnnual");
					return localizationKeys("billing.manageSubscription");
				}
				return localizationKeys("billing.manageSubscription");
			}
			return subscriptionItems.filter((subscription) => !subscription.plan.isDefault).length > 0 ? localizationKeys("billing.switchPlan") : freeTrialOr(localizationKeys("billing.subscribe"));
		};
		return {
			localizationKey: freeTrialOr(getLocalizationKey()),
			variant: isCompact ? "bordered" : "solid",
			colorScheme: isCompact ? "secondary" : "primary",
			isDisabled: !canManageBilling || exceedsPlanSeatLimit,
			disabled: !canManageBilling || exceedsPlanSeatLimit
		};
	}, [
		activeOrUpcomingSubscriptionWithPlanPeriod,
		canManageBilling,
		subscriberType,
		subscriptionItems,
		topLevelSubscription
	]);
	const captionForSubscription = useCallback((subscription) => {
		if (subscription.pastDueAt) return localizationKeys("badge__pastDueAt", { date: subscription.pastDueAt });
		if (subscription.status === "upcoming") return localizationKeys("badge__startsAt", { date: subscription.periodStart });
		if (subscription.canceledAt) return localizationKeys("badge__canceledEndsAt", { date: subscription.periodEnd });
		if (subscription.periodEnd) return localizationKeys(subscription.isFreeTrial ? "badge__trialEndsAt" : "badge__renewsAt", { date: subscription.periodEnd });
	}, []);
	const openSubscriptionDetails = useCallback((event) => {
		const portalRoot = getClosestProfileScrollBox("modal", event);
		clerk.__internal_openSubscriptionDetails({
			for: subscriberType,
			onSubscriptionCancel: () => {
				revalidateAll();
			},
			portalRoot
		});
	}, [
		clerk,
		subscriberType,
		revalidateAll
	]);
	return {
		activeOrUpcomingSubscription,
		activeAndUpcomingSubscriptions,
		activeOrUpcomingSubscriptionBasedOnPlanPeriod: activeOrUpcomingSubscriptionWithPlanPeriod,
		isDefaultPlanImplicitlyActiveOrUpcoming,
		handleSelectPlan: useCallback(({ plan, planPeriod, seatsQuantity, priceId, mode = "mounted", event, portalRoot: providedPortalRoot, appearance, newSubscriptionRedirectUrl, onSubscriptionComplete }) => {
			const portalRoot = providedPortalRoot ?? getClosestProfileScrollBox(mode, event);
			clerk.__internal_openCheckout({
				planId: plan.id,
				planPeriod: determinePlanPeriod(plan, planPeriod),
				for: subscriberType,
				seatsQuantity,
				priceId,
				onSubscriptionComplete: () => {
					revalidateAll();
					onSubscriptionComplete?.();
				},
				onClose: () => {
					if (session?.id) clerk.setActive({ session: session.id });
				},
				appearance,
				portalRoot,
				newSubscriptionRedirectUrl
			});
		}, [
			clerk,
			revalidateAll,
			subscriberType,
			session?.id
		]),
		openSubscriptionDetails,
		buttonPropsForPlan,
		canManageSubscription,
		captionForSubscription,
		defaultFreePlan: useMemo(() => {
			return plans?.find((plan) => plan.isDefault);
		}, [plans]),
		revalidateAll
	};
};
function determinePlanPeriod(plan, period) {
	if (period === "month" && plan.fee || period === "annual" && plan.annualMonthlyFee) return period;
	if (period === "month" && !plan.fee) return "annual";
	if (period === "annual" && !plan.annualMonthlyFee) return "month";
	return period;
}

//#endregion
export { useCreditBalance, useCreditHistory, usePaymentAttempts, usePaymentMethods, usePlans, usePlansContext, useStatements, useSubscription };
//# sourceMappingURL=Plans.js.map