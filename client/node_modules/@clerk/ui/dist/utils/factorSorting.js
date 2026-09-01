//#region src/utils/factorSorting.ts
const makeSortingOrderMap = (arr) => arr.reduce((acc, k, i) => {
	acc[k] = i;
	return acc;
}, {});
const STRATEGY_SORT_ORDER_PASSWORD_PREF = makeSortingOrderMap([
	"passkey",
	"password",
	"email_link",
	"email_code",
	"phone_code"
]);
const STRATEGY_SORT_ORDER_OTP_PREF = makeSortingOrderMap([
	"email_link",
	"email_code",
	"phone_code",
	"passkey",
	"password"
]);
const STRATEGY_SORT_ORDER_ALL_STRATEGIES_BUTTONS = makeSortingOrderMap([
	"email_link",
	"email_code",
	"phone_code",
	"passkey",
	"password"
]);
const STRATEGY_SORT_ORDER_BACKUP_CODE_PREF = makeSortingOrderMap([
	"totp",
	"phone_code",
	"backup_code"
]);
const makeSortingFunction = (sortingMap) => (a, b) => {
	const orderA = sortingMap[a.strategy];
	const orderB = sortingMap[b.strategy];
	if (orderA === void 0 || orderB === void 0) return 0;
	return orderA - orderB;
};
const passwordPrefFactorComparator = makeSortingFunction(STRATEGY_SORT_ORDER_PASSWORD_PREF);
const otpPrefFactorComparator = makeSortingFunction(STRATEGY_SORT_ORDER_OTP_PREF);
const backupCodePrefFactorComparator = makeSortingFunction(STRATEGY_SORT_ORDER_BACKUP_CODE_PREF);
const allStrategiesButtonsComparator = makeSortingFunction(STRATEGY_SORT_ORDER_ALL_STRATEGIES_BUTTONS);

//#endregion
export { allStrategiesButtonsComparator, backupCodePrefFactorComparator, otpPrefFactorComparator, passwordPrefFactorComparator };
//# sourceMappingURL=factorSorting.js.map