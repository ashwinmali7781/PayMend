import { localizationKeys } from "../localization/localizationKeys.js";

//#region src/utils/billing.ts
function getDiscountDescription(discount, cycles, planPeriod, { $, t }) {
	const amount = discount.effect === "percentage" && discount.percentOff !== void 0 ? `${discount.percentOff}%` : discount.amountOff ? $(discount.amountOff) : "";
	if (cycles == null) return t(localizationKeys("billing.discountAmount", { amount }));
	return t(localizationKeys("billing.discountDuration", {
		amount,
		cycles,
		period: getBillingPeriodLabel(planPeriod, cycles, t)
	}));
}
function getBillingPeriodLabel(planPeriod, cycles, t) {
	return t(localizationKeys(planPeriod === "annual" ? cycles === 1 ? "billing.year" : "billing.years" : cycles === 1 ? "billing.month" : "billing.months")).toLocaleLowerCase();
}
/**
* Given a BillingMoneyAmount, convert positive values to negative. If the amount is already negative, leave it alone.
*/
function toNegativeAmount(amount) {
	if (amount.amount < 0) return amount;
	return {
		...amount,
		amount: -amount.amount,
		amountFormatted: `-${amount.amountFormatted}`
	};
}

//#endregion
export { getBillingPeriodLabel, getDiscountDescription, toNegativeAmount };
//# sourceMappingURL=billing.js.map