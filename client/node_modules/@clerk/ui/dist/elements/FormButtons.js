import { useNavigateToFlowStart } from "../hooks/useNavigateToFlowStart.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { Flex } from "../customizables/index.js";
import { Form } from "./Form.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/FormButtons.tsx
const FormButtons = (props) => {
	const { isDisabled, onReset, submitLabel, resetLabel, hideReset, ...rest } = props;
	const { navigateToFlowStart } = useNavigateToFlowStart();
	return /* @__PURE__ */ jsxs(FormButtonContainer, { children: [/* @__PURE__ */ jsx(Form.SubmitButton, {
		block: false,
		isDisabled,
		localizationKey: submitLabel || localizationKeys("userProfile.formButtonPrimary__save"),
		...rest
	}), !hideReset && /* @__PURE__ */ jsx(Form.ResetButton, {
		localizationKey: resetLabel || localizationKeys("userProfile.formButtonReset"),
		block: false,
		onClick: onReset || navigateToFlowStart
	})] });
};
const FormButtonContainer = (props) => {
	return /* @__PURE__ */ jsx(Flex, {
		direction: "rowReverse",
		gap: 2,
		...props,
		children: props.children
	});
};

//#endregion
export { FormButtonContainer, FormButtons };
//# sourceMappingURL=FormButtons.js.map