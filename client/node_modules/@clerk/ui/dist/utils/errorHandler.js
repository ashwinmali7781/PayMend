import { isClerkAPIResponseError, isClerkRuntimeError, isKnownError, isMetamaskError } from "@clerk/shared/error";
import { snakeToCamel } from "@clerk/shared/underscore";

//#region src/utils/errorHandler.ts
const getFirstError = (err) => err[0];
function setFieldErrors(fieldStates, errors) {
	if (!errors || errors.length < 1) return;
	fieldStates.forEach((field) => {
		let buildErrorMessage = field?.buildErrorMessage;
		if (!buildErrorMessage) buildErrorMessage = getFirstError;
		const errorsArray = errors.filter((err) => {
			return err.meta?.paramName === field.id || snakeToCamel(err.meta?.paramName) === field.id;
		});
		const errorMessage = buildErrorMessage(errorsArray);
		if (errorsArray.length && errorMessage) field.setError(errorMessage);
		else field.clearFeedback();
	});
}
function parseErrors(errors) {
	return (errors || []).reduce((memo, err) => {
		if (err.meta?.paramName) memo.fieldErrors.push(err);
		else memo.globalErrors.push(err);
		return memo;
	}, {
		fieldErrors: Array(0),
		globalErrors: Array(0)
	});
}
const handleError = (err, fieldStates, setGlobalError) => {
	if (!isKnownError(err)) throw err;
	if (isMetamaskError(err)) return handleMetamaskError(err, fieldStates, setGlobalError);
	if (isClerkAPIResponseError(err)) return handleClerkApiError(err, fieldStates, setGlobalError);
	if (isClerkRuntimeError(err) && err.code === "reverification_cancelled") return;
	if (isClerkRuntimeError(err)) return handleClerkRuntimeError(err, fieldStates, setGlobalError);
};
function getGlobalError(err) {
	if (!isClerkAPIResponseError(err)) return;
	const { globalErrors } = parseErrors(err.errors);
	if (!globalErrors.length) return;
	return globalErrors[0];
}
function getFieldError(err) {
	if (!isClerkAPIResponseError(err)) return;
	const { fieldErrors } = parseErrors(err.errors);
	if (!fieldErrors.length) return;
	return fieldErrors[0];
}
const handleMetamaskError = (err, _, setGlobalError) => {
	return setGlobalError?.(err.message);
};
const handleClerkApiError = (err, fieldStates, setGlobalError) => {
	if (!isClerkAPIResponseError(err)) return;
	const { fieldErrors, globalErrors } = parseErrors(err.errors);
	setFieldErrors(fieldStates, fieldErrors);
	if (setGlobalError) {
		setGlobalError(void 0);
		const firstGlobalError = globalErrors[0];
		if (firstGlobalError) setGlobalError(firstGlobalError);
	}
};
const handleClerkRuntimeError = (err, _, setGlobalError) => {
	if (!isClerkRuntimeError(err)) return;
	if (setGlobalError) {
		setGlobalError(void 0);
		const firstGlobalError = err;
		if (firstGlobalError) setGlobalError(firstGlobalError);
	}
};

//#endregion
export { getFieldError, getGlobalError, handleError };
//# sourceMappingURL=errorHandler.js.map