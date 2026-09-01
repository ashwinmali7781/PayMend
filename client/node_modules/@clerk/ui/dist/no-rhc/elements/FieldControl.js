import { localizationKeys } from "../localization/localizationKeys.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { FormFieldContextProvider, sanitizeInputProps, useFormField } from "../primitives/hooks/useFormField.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { CheckboxInput, Flex, FormLabel, Icon, Input, Link, Text } from "../customizables/index.js";
import { OTPCodeControl, OTPResendButton, OTPRoot } from "./CodeControl.js";
import { FormFeedback } from "./FormControl.js";
import { InputGroup } from "./InputGroup.js";
import { PasswordInput } from "./PasswordInput.js";
import { PhoneInput } from "./PhoneInput/index.js";
import { RadioItem, RadioLabel } from "./RadioGroup.js";
import React, { forwardRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/FieldControl.tsx
const Root = (props) => {
	const card = useCardState();
	const { autoFocus: optionAutoFocus } = useAppearance().parsedOptions;
	const { children, isDisabled: isDisabledProp, ...restProps } = props;
	const isDisabled = isDisabledProp || card.isLoading;
	return /* @__PURE__ */ jsx(FormFieldContextProvider, {
		...restProps,
		isDisabled,
		autoFocus: optionAutoFocus && restProps.autoFocus,
		children
	});
};
const FieldAction = (props) => {
	const { fieldId, isDisabled } = useFormField();
	if (!props.localizationKey && !props.children) return null;
	return /* @__PURE__ */ jsx(Link, {
		localizationKey: props.localizationKey,
		elementDescriptor: descriptors.formFieldAction,
		elementId: descriptors.formFieldLabel.setId(fieldId),
		isDisabled,
		colorScheme: "primary",
		variant: "buttonSmall",
		onClick: (e) => {
			e.preventDefault();
			props.onClick?.(e);
		},
		children: props.children
	});
};
const FieldOptionalLabel = () => {
	const { fieldId, isDisabled } = useFormField();
	return /* @__PURE__ */ jsx(Text, {
		localizationKey: localizationKeys("formFieldHintText__optional"),
		elementDescriptor: descriptors.formFieldHintText,
		elementId: descriptors.formFieldHintText.setId(fieldId),
		as: "span",
		variant: "caption",
		colorScheme: "secondary",
		isDisabled
	});
};
const FieldLabelIcon = (props) => {
	const { t } = useLocalizations();
	if (!props.icon) return null;
	return /* @__PURE__ */ jsx(Flex, {
		as: "span",
		title: t(localizationKeys("formFieldHintText__slug")),
		sx: { marginInlineEnd: "auto" },
		children: /* @__PURE__ */ jsx(Icon, {
			icon: props.icon,
			sx: (theme) => ({
				marginInlineStart: theme.space.$0x5,
				color: theme.colors.$neutralAlpha400,
				width: theme.sizes.$4,
				height: theme.sizes.$4
			})
		})
	});
};
const FieldLabel = (props) => {
	const { isRequired, id, label, isDisabled, hasError } = useFormField();
	if (!(props.localizationKey || label) && !props.children) return null;
	return /* @__PURE__ */ jsx(FormLabel, {
		localizationKey: props.localizationKey || label,
		elementDescriptor: descriptors.formFieldLabel,
		elementId: descriptors.formFieldLabel.setId(id),
		hasError: !!hasError,
		isDisabled,
		isRequired,
		sx: {
			display: "flex",
			alignItems: "center"
		},
		children: props.children
	});
};
const FieldLabelRow = (props) => {
	const { fieldId } = useFormField();
	return /* @__PURE__ */ jsx(Flex, {
		justify: "between",
		align: "center",
		elementDescriptor: descriptors.formFieldLabelRow,
		elementId: descriptors.formFieldLabelRow.setId(fieldId),
		children: props.children
	});
};
const FieldFeedback = (props) => {
	const { fieldId, debouncedFeedback } = useFormField();
	return /* @__PURE__ */ jsx(FormFeedback, {
		center: props.center,
		...debouncedFeedback,
		elementDescriptors: props.elementDescriptors,
		id: fieldId
	});
};
const PhoneInputElement = forwardRef((_, ref) => {
	const { t } = useLocalizations();
	const formField = useFormField();
	const { placeholder, ...inputProps } = sanitizeInputProps(formField);
	return /* @__PURE__ */ jsx(PhoneInput, {
		ref,
		elementDescriptor: descriptors.formFieldInput,
		elementId: descriptors.formFieldInput.setId(formField.fieldId),
		...inputProps,
		feedbackType: formField.feedbackType,
		placeholder: t(placeholder)
	});
});
const PasswordInputElement = forwardRef((_, ref) => {
	const { t } = useLocalizations();
	const formField = useFormField();
	const { placeholder, ...inputProps } = sanitizeInputProps(formField, [
		"validatePassword",
		"setError",
		"setWarning",
		"setSuccess",
		"setInfo",
		"setHasPassedComplexity"
	]);
	return /* @__PURE__ */ jsx(PasswordInput, {
		ref,
		elementDescriptor: descriptors.formFieldInput,
		elementId: descriptors.formFieldInput.setId(formField.fieldId),
		...inputProps,
		placeholder: t(placeholder)
	});
});
const CheckboxIndicator = forwardRef(({ elementDescriptor, elementId }, ref) => {
	const formField = useFormField();
	const { placeholder, ...inputProps } = sanitizeInputProps(formField);
	return /* @__PURE__ */ jsx(CheckboxInput, {
		ref,
		...inputProps,
		elementDescriptor: elementDescriptor || descriptors.formFieldInput,
		elementId: elementId || descriptors.formFieldInput.setId(formField.fieldId),
		focusRing: false,
		sx: (t) => ({
			flexShrink: 0,
			marginTop: t.space.$0x5
		})
	});
});
const CheckboxLabel = (props) => {
	const { label, id } = useFormField();
	if (!label) return null;
	return /* @__PURE__ */ jsx(RadioLabel, {
		label,
		id,
		description: props.description
	});
};
const InputElement = forwardRef(({ elementDescriptor }, ref) => {
	const { t } = useLocalizations();
	const formField = useFormField();
	const { placeholder, ...inputProps } = sanitizeInputProps(formField);
	return /* @__PURE__ */ jsx(Input, {
		ref,
		elementDescriptor: elementDescriptor || descriptors.formFieldInput,
		elementId: descriptors.formFieldInput.setId(formField.fieldId),
		...inputProps,
		placeholder: t(placeholder)
	});
});
const InputGroupElement = forwardRef((props, ref) => {
	const { t } = useLocalizations();
	const formField = useFormField();
	const { placeholder, ...inputProps } = sanitizeInputProps(formField);
	return /* @__PURE__ */ jsx(InputGroup, {
		ref,
		elementDescriptor: descriptors.formFieldInput,
		elementId: descriptors.formFieldInput.setId(formField.fieldId),
		...inputProps,
		groupPrefix: props.groupPrefix,
		groupSuffix: props.groupSuffix,
		placeholder: t(placeholder)
	});
});
const Field = {
	Root,
	Label: FieldLabel,
	LabelRow: FieldLabelRow,
	Input: InputElement,
	PasswordInput: PasswordInputElement,
	PhoneInput: PhoneInputElement,
	InputGroup: InputGroupElement,
	RadioItem,
	CheckboxIndicator,
	CheckboxLabel,
	Action: FieldAction,
	AsOptional: FieldOptionalLabel,
	LabelIcon: FieldLabelIcon,
	Feedback: FieldFeedback,
	OTPRoot,
	OTPCodeControl,
	OTPResendButton
};

//#endregion
export { Field };
//# sourceMappingURL=FieldControl.js.map