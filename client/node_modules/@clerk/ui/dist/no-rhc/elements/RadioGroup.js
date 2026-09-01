import { sanitizeInputProps, useFormField } from "../primitives/hooks/useFormField.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, FormLabel, RadioInput, Text } from "../customizables/index.js";
import { forwardRef, useId } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/RadioGroup.tsx
const RadioIndicator = forwardRef((props, ref) => {
	const { value, placeholder, ...inputProps } = sanitizeInputProps(useFormField());
	return /* @__PURE__ */ jsx(RadioInput, {
		ref,
		...inputProps,
		elementDescriptor: descriptors.formFieldRadioInput,
		id: props.id,
		focusRing: false,
		sx: (t) => ({
			width: "fit-content",
			marginTop: t.space.$0x5
		}),
		value: props.value,
		checked: props.value === value
	});
});
const RadioLabel = (props) => {
	return /* @__PURE__ */ jsxs(FormLabel, {
		elementDescriptor: descriptors.formFieldRadioLabel,
		htmlFor: props.id,
		sx: (t) => ({
			padding: `${t.space.$none} ${t.space.$2}`,
			display: "flex",
			flexDirection: "column"
		}),
		children: [/* @__PURE__ */ jsx(Text, {
			elementDescriptor: descriptors.formFieldRadioLabelTitle,
			variant: "subtitle",
			localizationKey: props.label
		}), props.description && /* @__PURE__ */ jsx(Text, {
			elementDescriptor: descriptors.formFieldRadioLabelDescription,
			colorScheme: "secondary",
			localizationKey: props.description
		})]
	});
};
const RadioItem = forwardRef((props, ref) => {
	const randomId = useId();
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.formFieldRadioGroupItem,
		align: "start",
		children: [/* @__PURE__ */ jsx(RadioIndicator, {
			id: randomId,
			ref,
			value: props.value
		}), /* @__PURE__ */ jsx(RadioLabel, {
			id: randomId,
			label: props.label,
			description: props.description
		})]
	});
});

//#endregion
export { RadioItem, RadioLabel };
//# sourceMappingURL=RadioGroup.js.map