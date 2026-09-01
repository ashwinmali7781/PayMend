import { useFormControlFeedback } from "../../utils/useFormControl.js";
import React from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/hooks/useFormField.tsx
/**
* Extract the context hook without the guarantee in order to avoid throwing errors if our field/form primitives are not wrapped inside a Field.Root component.
* In case our primitives need to always be wrapped with Field.Root, consider updating the following line to [FormFieldContext, useFormField]
*/
const [FormFieldContext, , useFormField] = createContextAndHook("FormFieldContext");
const FormFieldContextProvider = (props) => {
	const { id: propsId, isRequired = false, isDisabled = false, setError, setSuccess, setWarning, setHasPassedComplexity, setInfo, clearFeedback, children, feedbackType, feedback, isFocused, ...rest } = props;
	const id = `${propsId}-field`;
	const { debounced } = useFormControlFeedback({
		feedback,
		feedbackType,
		isFocused
	});
	const hasError = debounced.feedbackType === "error";
	const feedbackMessageId = debounced.feedback ? debounced.feedbackType === "error" ? `error-${propsId}` : `${propsId}-${debounced.feedbackType}-feedback` : "";
	const value = React.useMemo(() => ({
		isRequired,
		isDisabled,
		hasError,
		id,
		fieldId: propsId,
		feedbackMessageId,
		setError,
		setSuccess,
		setWarning,
		setInfo,
		clearFeedback,
		setHasPassedComplexity,
		feedbackType,
		feedback,
		isFocused
	}), [
		isRequired,
		hasError,
		id,
		propsId,
		feedbackMessageId,
		isDisabled,
		setError,
		setSuccess,
		setWarning,
		setInfo,
		clearFeedback,
		setHasPassedComplexity,
		feedbackType,
		feedback,
		isFocused
	]);
	return /* @__PURE__ */ jsx(FormFieldContext.Provider, {
		value: { value: {
			...value,
			...rest,
			/**
			* Keep both debounced and regular feedback state inside the context
			*/
			debouncedFeedback: debounced
		} },
		children: props.children
	});
};
/**
* Each of our Form primitives depend on different custom props
* This utility filters out any props that will litter the DOM, but allows for exceptions when the `keep` param is used.
* This allows for maintainers to opt-in and only allow for specific props to be passed for each primitive.
*/
const sanitizeInputProps = (obj, keep) => {
	const { radioOptions, validatePassword, hasPassedComplexity, isFocused, feedback, feedbackType, setHasPassedComplexity, setWarning, setSuccess, setError, setInfo, feedbackMessageId, fieldId, label, clearFeedback, infoText, debouncedFeedback, ignorePasswordManager, transformer, ...inputProps } = obj;
	keep?.forEach((key) => {
		/**
		* Ignore error for the index type as we have defined it explicitly above
		*/
		inputProps[key] = obj[key];
	});
	return inputProps;
};

//#endregion
export { FormFieldContextProvider, sanitizeInputProps, useFormField };
//# sourceMappingURL=useFormField.js.map