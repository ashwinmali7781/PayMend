import { descriptors } from "../customizables/elementDescriptors.js";
import { Text } from "../customizables/index.js";
import { stringToFormattedPhoneString } from "../utils/phoneUtils.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/FormattedPhoneNumber.tsx
const FormattedPhoneNumberText = (props) => {
	const formattedPhone = stringToFormattedPhoneString(props.value);
	return /* @__PURE__ */ jsx(Text, {
		as: "span",
		elementDescriptor: descriptors.formattedPhoneNumberText,
		children: formattedPhone
	});
};

//#endregion
export { FormattedPhoneNumberText };
//# sourceMappingURL=FormattedPhoneNumber.js.map