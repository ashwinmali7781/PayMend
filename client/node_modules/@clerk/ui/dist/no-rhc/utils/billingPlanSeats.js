import { localizationKeys } from "../localization/localizationKeys.js";

//#region src/utils/billingPlanSeats.ts
/**
* Given a plan, return the unit price for seats.
*/
const getSeatUnitPrice = (plan) => {
	if (!plan.unitPrices?.length) return null;
	const seatUnitPrice = plan.unitPrices.find((unitPrice) => unitPrice.name === "seats");
	if (seatUnitPrice) return seatUnitPrice;
	return null;
};
/**
* Given payment totals, return the per-unit total entry for seats, if present.
*/
const getSeatsPerUnitTotal = (totals) => {
	return totals?.perUnitTotals?.find((unitTotal) => unitTotal.name.toLowerCase() === "seats");
};
/**
* Summarize a seats per-unit total for display in a payment breakdown.
*
* Returns `null` when there is no paid quantity to charge for — either because the plan has no
* per-seat pricing at all (only a seat limit), or because the org's occupied seats fall entirely
* within the included tier (right-sized by the backend so the only tier carries `feePerBlock = $0`).
*
* Returns `{ totalSeats, included, paidTier }` otherwise.
*/
const summarizeSeatCharges = (seatsTotal) => {
	if (!seatsTotal) return null;
	const paidTier = seatsTotal.tiers.find((tier) => tier.feePerBlock.amount > 0);
	if (!paidTier) return null;
	let totalSeats = 0;
	let included = 0;
	for (const tier of seatsTotal.tiers) {
		if (tier.quantity === null) continue;
		totalSeats += tier.quantity;
		if (tier.feePerBlock.amount === 0) included += tier.quantity;
	}
	return {
		totalSeats,
		included,
		paidTier
	};
};
/**
* Similar to the above, given a checkout totals, return the unit price for seats.
*/
const getCheckoutSeatUnitTotal = (checkout) => {
	if (!checkout.perUnitTotals?.length) return null;
	const seatUnitPrice = checkout.perUnitTotals.find((unitTotal) => unitTotal.name === "seats");
	if (seatUnitPrice) return seatUnitPrice;
	return null;
};
/**
* Given a checkout unit total, return the unit total tier that represents per-seat costs. If no tier is found, return null.
*/
const getPaidSeatsUnitTotalTier = (unitTotal) => {
	if (!unitTotal) return null;
	if (unitTotal.tiers.length === 1 && unitTotal.tiers[0].feePerBlock.amount > 0) return unitTotal.tiers[0];
	if (unitTotal.tiers.length === 2 && unitTotal.tiers[0].feePerBlock.amount === 0 && unitTotal.tiers[1].feePerBlock.amount > 0) return unitTotal.tiers[1];
	return null;
};
/**
* Given a checkout unit total, return the unit total tier that represents included seats. If no tier is found, return null.
*/
const getIncludedSeatsUnitTotalTier = (unitTotal) => {
	if (!unitTotal) return null;
	if (unitTotal.tiers.length === 2 && unitTotal.tiers[0].feePerBlock.amount === 0 && unitTotal.tiers[1].feePerBlock.amount > 0) return unitTotal.tiers[0];
	return null;
};
/**
* Given a plan unit price, return the unit price tier that represents included seats. If no tier is found, return null.
*/
const getIncludedSeatsUnitTier = (unitPrice) => {
	if (!unitPrice) return null;
	if (unitPrice.tiers.length === 2 && unitPrice.tiers[0].feePerBlock.amount === 0 && unitPrice.tiers[1].feePerBlock.amount > 0) return unitPrice.tiers[0];
	return null;
};
const getPaidSeatsUnitTier = (unitPrice) => {
	if (!unitPrice) return null;
	if (unitPrice.tiers.length === 1 && unitPrice.tiers[0].feePerBlock.amount > 0) return unitPrice.tiers[0];
	if (unitPrice.tiers.length === 2 && unitPrice.tiers[0].feePerBlock.amount === 0 && unitPrice.tiers[1].feePerBlock.amount > 0) return unitPrice.tiers[1];
	return null;
};
/**
* Given a plan, return the seat limit for the plan in seats (not blocks), or `null` if seats are
* unlimited, or `undefined` if the plan has no seat-based pricing.
*/
const getPlanSeatLimit = (plan) => {
	const seatUnitPrice = getSeatUnitPrice(plan);
	if (!seatUnitPrice?.tiers.length) return;
	const lastTier = seatUnitPrice.tiers[seatUnitPrice.tiers.length - 1];
	return lastTier.endsAfterBlock != null ? lastTier.endsAfterBlock * seatUnitPrice.blockSize : null;
};
const getSeatLimitAndIncludedSeatsLocalizationKey = (plan) => {
	const seatUnitPrice = getSeatUnitPrice(plan);
	const includedSeatsUnitTier = getIncludedSeatsUnitTier(seatUnitPrice);
	const planSeatLimit = getPlanSeatLimit(plan);
	const includedSeats = includedSeatsUnitTier?.endsAfterBlock != null && seatUnitPrice ? includedSeatsUnitTier.endsAfterBlock * seatUnitPrice.blockSize : null;
	if (typeof planSeatLimit === "number" && includedSeats !== null) return localizationKeys("organizationProfile.billingPage.subscriptionsListSection.seatLimitAndIncludedSeats", {
		seatLimit: planSeatLimit,
		includedSeats
	});
	if (typeof planSeatLimit === "number") return localizationKeys("organizationProfile.billingPage.subscriptionsListSection.seatLimit", { seatLimit: planSeatLimit });
	if (includedSeats !== null) return localizationKeys("organizationProfile.billingPage.subscriptionsListSection.includedSeatsUsage", { includedSeats });
	return null;
};
/**
* Given a plan and an organization, return true if the organization exceeds the seat limit for the plan.
*/
const organizationExceedsPlanSeatLimit = (plan, organization) => {
	const seatLimit = getPlanSeatLimit(plan);
	if (seatLimit === void 0 || seatLimit === null) return false;
	return organization.membersCount + organization.pendingInvitationsCount > seatLimit;
};
const organizationAndInvitationsExceedsPurchasedSeats = (subscriptionItem, organization, invitationsCount) => {
	if (!subscriptionItem || !subscriptionItem.seats || !subscriptionItem.seats.quantity) return false;
	return organization.membersCount + organization.pendingInvitationsCount + invitationsCount > subscriptionItem.seats.quantity;
};
const isPlanWithPerSeatCosts = (plan) => {
	const seatUnitPrice = getSeatUnitPrice(plan);
	if (!seatUnitPrice) return false;
	if (seatUnitPrice.tiers.length === 1 && seatUnitPrice.tiers[0].feePerBlock.amount > 0) return true;
	if (seatUnitPrice.tiers.length === 2 && seatUnitPrice.tiers[1].feePerBlock.amount > 0) return true;
	return false;
};

//#endregion
export { getCheckoutSeatUnitTotal, getIncludedSeatsUnitTotalTier, getPaidSeatsUnitTier, getPaidSeatsUnitTotalTier, getPlanSeatLimit, getSeatLimitAndIncludedSeatsLocalizationKey, getSeatUnitPrice, getSeatsPerUnitTotal, isPlanWithPerSeatCosts, organizationAndInvitationsExceedsPurchasedSeats, organizationExceedsPlanSeatLimit, summarizeSeatCharges };
//# sourceMappingURL=billingPlanSeats.js.map