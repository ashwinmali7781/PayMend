import { createInfiniteAccessProxy } from "../utils/createInfiniteAccessProxy.js";
import { fastDeepMergeAndReplace } from "@clerk/shared/utils";

//#region src/styledSystem/createVariants.ts
const createVariants = (configFn) => {
	const applyVariants = (props = {}) => (theme) => {
		const { base, variants = {}, compoundVariants = [], defaultVariants = {} } = configFn(theme, props);
		const variantsToApply = calculateVariantsToBeApplied(variants, props, defaultVariants);
		const computedStyles = {};
		applyBaseRules(computedStyles, base);
		applyVariantRules(computedStyles, variantsToApply, variants);
		applyCompoundVariantRules(computedStyles, variantsToApply, compoundVariants);
		sanitizeCssVariables(computedStyles);
		return computedStyles;
	};
	const fakeProxyTheme = createInfiniteAccessProxy();
	const variantKeys = Object.keys(configFn(fakeProxyTheme, fakeProxyTheme).variants || {});
	const filterProps = (props) => getPropsWithoutVariants(props, variantKeys);
	return {
		applyVariants,
		filterProps
	};
};
const getPropsWithoutVariants = (props, variants) => {
	const res = { ...props };
	for (const key of variants) delete res[key];
	return res;
};
const applyBaseRules = (computedStyles, base) => {
	if (base && typeof base === "object") Object.assign(computedStyles, base);
};
const applyVariantRules = (computedStyles, variantsToApply, variants) => {
	for (const key in variantsToApply) fastDeepMergeAndReplace(variants[key][variantsToApply[key]], computedStyles);
};
const applyCompoundVariantRules = (computedStyles, variantsToApply, compoundVariants) => {
	for (const compoundVariant of compoundVariants) if (conditionMatches(compoundVariant, variantsToApply)) fastDeepMergeAndReplace(compoundVariant.styles, computedStyles);
};
const sanitizeCssVariables = (computedStyles) => {
	for (const key in computedStyles) if (key.startsWith("var(")) {
		computedStyles[key.slice(4, -1)] = computedStyles[key];
		delete computedStyles[key];
	}
};
const calculateVariantsToBeApplied = (variants, props, defaultVariants) => {
	const variantsToApply = {};
	for (const key in variants) if (key in props) variantsToApply[key] = props[key];
	else if (key in defaultVariants) variantsToApply[key] = defaultVariants[key];
	return variantsToApply;
};
const conditionMatches = ({ condition }, variants) => {
	for (const key in condition) if (condition[key] !== variants[key]) return false;
	return true;
};

//#endregion
export { createVariants };
//# sourceMappingURL=createVariants.js.map