//#region src/utils/disambiguateRedirectOptions.ts
/**
* Ensures redirect props have the appropriate prefix depending on the flow they were originally provided to. Used when passing props from sign up -> sign in, or vice versa, when rendering modals.
*/
function disambiguateRedirectOptions(props, flow) {
	if (!props) return {};
	const prefix = flow === "signin" ? "signIn" : "signUp";
	const prefixedOptions = {
		[`${prefix}ForceRedirectUrl`]: props.forceRedirectUrl,
		[`${prefix}FallbackRedirectUrl`]: props.fallbackRedirectUrl
	};
	const result = {
		...props,
		...prefixedOptions
	};
	delete result.forceRedirectUrl;
	delete result.fallbackRedirectUrl;
	return result;
}

//#endregion
export { disambiguateRedirectOptions };
//# sourceMappingURL=disambiguateRedirectOptions.js.map