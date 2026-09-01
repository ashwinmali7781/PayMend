//#region src/components/PricingTable/utils/pricing-footer-state.ts
/**
* Calculates the correct show/hide state for the footer of a card in the `<PricingTableDefault/>` component.
* @returns [shouldShowFooter, shouldShowFooterNotice]
*/
const valueResolution = (params) => {
	const { subscription, plan, planPeriod, for: forWhom, hasActiveOrganization } = params;
	const show_with_notice = [true, true];
	const show_without_notice = [true, false];
	const hide = [false, false];
	if (!subscription) {
		if (forWhom === "organization" && !hasActiveOrganization) return hide;
		return show_without_notice;
	}
	if (subscription.status === "upcoming") return show_with_notice;
	if (subscription.status === "active") {
		const isCanceled = !!subscription.canceledAt;
		const isSwitchingPaidPeriod = planPeriod !== subscription.planPeriod && Boolean(plan.annualMonthlyFee?.amount);
		const isActiveFreeTrial = plan.freeTrialEnabled && subscription.isFreeTrial;
		if (isCanceled || isSwitchingPaidPeriod) return show_without_notice;
		if (isActiveFreeTrial) return show_with_notice;
		return hide;
	}
	return hide;
};
const getPricingFooterState = (params) => {
	const [shouldShowFooter, shouldShowFooterNotice] = valueResolution(params);
	return {
		shouldShowFooter,
		shouldShowFooterNotice
	};
};

//#endregion
export { getPricingFooterState };
//# sourceMappingURL=pricing-footer-state.js.map