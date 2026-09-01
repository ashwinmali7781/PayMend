import { useLoadingStatus } from "../hooks/useLoadingStatus.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { Button, Col, Flex, Form as Form$1 } from "../customizables/index.js";
import { LastAuthenticationStrategyBadge } from "./Badge.js";
import { Field } from "./FieldControl.js";
import React, { forwardRef, useState } from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Form.tsx
const [FormState, useFormState] = createContextAndHook("FormState");
const FormRoot = (props) => {
	const card = useCardState();
	const status = useLoadingStatus();
	const [submittedWithEnter, setSubmittedWithEnter] = useState(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!props.onSubmit) return;
		try {
			card.setLoading();
			status.setLoading();
			setSubmittedWithEnter(true);
			await props.onSubmit(e);
		} finally {
			card.setIdle();
			status.setIdle();
		}
	};
	const value = React.useMemo(() => {
		return { value: {
			isLoading: status.isLoading,
			isDisabled: card.isLoading || status.isLoading,
			submittedWithEnter
		} };
	}, [
		card.isLoading,
		status.isLoading,
		submittedWithEnter
	]);
	return /* @__PURE__ */ jsx(FormState.Provider, {
		value,
		children: /* @__PURE__ */ jsxs(Form$1, {
			elementDescriptor: descriptors.form,
			gap: 6,
			...props,
			onSubmit,
			children: [/* @__PURE__ */ jsx("button", {
				type: "submit",
				"aria-hidden": true,
				style: {
					visibility: "hidden",
					position: "absolute"
				}
			}), props.children]
		})
	});
};
const FormSubmit = (props) => {
	const { isLoading, isDisabled } = useFormState();
	return /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.formButtonPrimary,
		block: true,
		textVariant: "buttonLarge",
		isLoading,
		isDisabled,
		type: "submit",
		...props,
		localizationKey: props.localizationKey || localizationKeys("formButtonPrimary")
	});
};
const FormReset = (props) => {
	const { isLoading, isDisabled } = useFormState();
	return /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.formButtonReset,
		block: true,
		variant: "ghost",
		type: "reset",
		isDisabled: isLoading || isDisabled,
		...props
	});
};
const FormControlRow = (props) => {
	const { elementId, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.formFieldRow,
		elementId: descriptors.formFieldRow.setId(elementId),
		justify: "between",
		gap: 4,
		...rest
	});
};
const CommonInputWrapper = (props) => {
	const { isOptional, isLastAuthenticationStrategy, icon, actionLabel, children, onActionClicked, ...fieldProps } = props;
	return /* @__PURE__ */ jsx(Field.Root, {
		...fieldProps,
		children: /* @__PURE__ */ jsxs(Col, {
			elementDescriptor: descriptors.formField,
			elementId: descriptors.formField.setId(fieldProps.id),
			sx: {
				position: "relative",
				flex: "1 1 auto"
			},
			children: [/* @__PURE__ */ jsxs(Flex, {
				direction: "col",
				sx: (t) => ({ gap: t.space.$2 }),
				children: [/* @__PURE__ */ jsxs(Field.LabelRow, { children: [
					/* @__PURE__ */ jsx(Field.Label, {}),
					/* @__PURE__ */ jsx(Field.LabelIcon, { icon }),
					!actionLabel && isOptional && /* @__PURE__ */ jsx(Field.AsOptional, {}),
					actionLabel && /* @__PURE__ */ jsx(Field.Action, {
						localizationKey: actionLabel,
						onClick: onActionClicked
					}),
					isLastAuthenticationStrategy && !actionLabel && !isOptional && /* @__PURE__ */ jsx(LastAuthenticationStrategyBadgeWithFormState, {}),
					/* @__PURE__ */ jsx(Field.Action, {})
				] }), children]
			}), /* @__PURE__ */ jsx(Field.Feedback, {})]
		})
	});
};
const LastAuthenticationStrategyBadgeWithFormState = (props) => {
	const { isLoading, isDisabled } = useFormState();
	return /* @__PURE__ */ jsx(LastAuthenticationStrategyBadge, {
		...props,
		sx: (t) => ({ opacity: isDisabled || isLoading ? t.opacity.$disabled : 1 })
	});
};
const PlainInput = (props) => {
	const { elementDescriptor, ...rest } = props;
	return /* @__PURE__ */ jsx(CommonInputWrapper, {
		...rest,
		children: /* @__PURE__ */ jsx(Field.Input, { elementDescriptor })
	});
};
const PasswordInput = forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(CommonInputWrapper, {
		...props,
		children: /* @__PURE__ */ jsx(Field.PasswordInput, { ref })
	});
});
const PhoneInput = (props) => {
	return /* @__PURE__ */ jsx(CommonInputWrapper, {
		...props,
		children: /* @__PURE__ */ jsx(Field.PhoneInput, {})
	});
};
const InputGroup = (props) => {
	const { groupSuffix, groupPrefix, ...fieldProps } = props;
	return /* @__PURE__ */ jsx(CommonInputWrapper, {
		...fieldProps,
		children: /* @__PURE__ */ jsx(Field.InputGroup, {
			groupSuffix,
			groupPrefix
		})
	});
};
const Checkbox = (props) => {
	return /* @__PURE__ */ jsx(Field.Root, {
		...props,
		children: /* @__PURE__ */ jsxs(Flex, {
			align: "start",
			children: [/* @__PURE__ */ jsx(Field.CheckboxIndicator, {}), /* @__PURE__ */ jsx(Field.CheckboxLabel, { description: props.description })]
		})
	});
};
const RadioGroup = (props) => {
	const { radioOptions, ...fieldProps } = props;
	return /* @__PURE__ */ jsxs(Field.Root, {
		...fieldProps,
		children: [/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.formFieldRadioGroup,
			gap: 3,
			children: radioOptions?.map(({ value, description, label }) => /* @__PURE__ */ jsx(Flex, {
				sx: (t) => ({
					borderWidth: t.borderWidths.$normal,
					borderStyle: t.borderStyles.$solid,
					borderColor: t.colors.$borderAlpha100,
					borderRadius: t.radii.$md,
					padding: t.space.$2
				}),
				children: /* @__PURE__ */ jsx(Field.RadioItem, {
					value,
					label,
					description
				})
			}, value))
		}), /* @__PURE__ */ jsx(Field.Feedback, {})]
	});
};
const OTPInput = (props) => {
	const { centerAlign = true } = props;
	return /* @__PURE__ */ jsx(Field.Root, {
		...props.otpControl.otpInputProps,
		children: /* @__PURE__ */ jsx(Field.OTPRoot, {
			...props,
			children: /* @__PURE__ */ jsxs(Col, {
				elementDescriptor: descriptors.form,
				gap: 2,
				align: centerAlign ? "center" : "start",
				children: [/* @__PURE__ */ jsxs(Flex, {
					elementDescriptor: descriptors.otpCodeField,
					isLoading: props.isLoading,
					hasError: props.otpControl.otpInputProps.feedbackType === "error",
					direction: "col",
					children: [/* @__PURE__ */ jsx(Field.OTPCodeControl, {}), /* @__PURE__ */ jsx(Field.Feedback, {
						center: true,
						elementDescriptors: {
							error: descriptors.otpCodeFieldErrorText,
							success: descriptors.otpCodeFieldSuccessText
						}
					})]
				}), /* @__PURE__ */ jsx(Field.OTPResendButton, {})]
			})
		})
	});
};
const Form = {
	Root: FormRoot,
	ControlRow: FormControlRow,
	PlainInput,
	PasswordInput,
	PhoneInput,
	OTPInput,
	InputGroup,
	RadioGroup,
	Checkbox,
	SubmitButton: FormSubmit,
	ResetButton: FormReset,
	CommonInputWrapper
};

//#endregion
export { Form };
//# sourceMappingURL=Form.js.map