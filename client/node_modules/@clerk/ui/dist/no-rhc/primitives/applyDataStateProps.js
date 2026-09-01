//#region src/primitives/applyDataStateProps.ts
const applyDataStateProps = (props) => {
	const { hasError, isDisabled, isLoading, isOpen, isActive, ...rest } = props;
	return {
		"data-error": hasError || void 0,
		"data-disabled": isDisabled || void 0,
		"data-loading": isLoading || void 0,
		"data-open": isOpen || void 0,
		"data-active": isActive || void 0,
		...rest
	};
};

//#endregion
export { applyDataStateProps };
//# sourceMappingURL=applyDataStateProps.js.map