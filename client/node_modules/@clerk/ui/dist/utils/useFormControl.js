import { useDebounce } from "../hooks/useDebounce.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { useState } from "react";

//#region src/utils/useFormControl.ts
const emailTransformer = (v) => v.trim();
const applyTransformers = (v, transformers) => {
	let value = v;
	for (let i = 0; i < transformers.length; i++) value = transformers[i](value);
	return value;
};
const useFormControl = (id, initialState, opts) => {
	const options = opts || {
		type: "text",
		label: "",
		isRequired: false,
		placeholder: "",
		options: [],
		defaultChecked: false
	};
	const transformers = [];
	if (options.transformer) transformers.push(options.transformer);
	if (options.type === "email") transformers.push(emailTransformer);
	const { translateError, t } = useLocalizations();
	const [value, setValueInternal] = useState(applyTransformers(initialState, transformers));
	const [isFocused, setFocused] = useState(false);
	const [checked, setCheckedInternal] = useState(options?.defaultChecked || false);
	const [hasPassedComplexity, setHasPassedComplexity] = useState(false);
	const [feedback, setFeedback] = useState({
		message: "",
		type: "info"
	});
	const onChange = (event) => {
		if (options?.type === "checkbox") return setCheckedInternal(event.target.checked);
		return setValueInternal(applyTransformers(event.target.value || "", transformers));
	};
	const setValue = (val) => setValueInternal(val || "");
	const setChecked = (checked) => setCheckedInternal(checked);
	const setError = (error) => {
		setFeedback({
			message: translateError(error),
			type: "error"
		});
	};
	const setSuccess = (message) => {
		setFeedback({
			message,
			type: "success"
		});
	};
	const setWarning = (warning) => {
		setFeedback({
			message: translateError(warning),
			type: "warning"
		});
	};
	const setInfo = (info) => {
		setFeedback({
			message: info,
			type: "info"
		});
	};
	const clearFeedback = () => {
		setFeedback({
			message: "",
			type: "info"
		});
	};
	const onFocus = () => {
		setFocused(true);
	};
	const onBlur = () => {
		setFocused(false);
	};
	const { defaultChecked, validatePassword: validatePasswordProp, buildErrorMessage, ...restOpts } = options;
	const props = {
		id,
		name: id,
		value,
		checked,
		setSuccess,
		setError,
		onChange,
		onBlur,
		onFocus,
		setWarning,
		feedback: feedback.message || t(options.infoText),
		feedbackType: feedback.type,
		setInfo,
		clearFeedback,
		hasPassedComplexity,
		setHasPassedComplexity,
		validatePassword: options.type === "password" ? options.validatePassword : void 0,
		isFocused,
		...restOpts
	};
	return {
		props,
		...props,
		buildErrorMessage,
		setError,
		setValue,
		setChecked
	};
};
const buildRequest = (fieldStates) => {
	const request = {};
	fieldStates.forEach((x) => {
		request[x.id] = x.type !== "checkbox" ? x.value : x.checked;
	});
	return request;
};
const useFormControlFeedback = (opts) => {
	const { feedback = "", delayInMs = 100, feedbackType = "info", isFocused = false } = opts || {};
	const shouldHide = isFocused ? false : ["info", "warning"].includes(feedbackType);
	return { debounced: useDebounce({
		feedback: shouldHide ? "" : feedback,
		feedbackType: shouldHide ? "info" : feedbackType
	}, delayInMs) };
};

//#endregion
export { buildRequest, useFormControl, useFormControlFeedback };
//# sourceMappingURL=useFormControl.js.map