import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { UVFactorOneCodeForm } from "./UVFactorOneCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UVFactorOnePhoneCodeCard.tsx
const UVFactorOnePhoneCodeCard = (props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "phoneCode",
		children: /* @__PURE__ */ jsx(UVFactorOneCodeForm, {
			...props,
			cardTitle: localizationKeys("reverification.phoneCode.title"),
			cardSubtitle: localizationKeys("reverification.phoneCode.subtitle"),
			inputLabel: localizationKeys("reverification.phoneCode.formTitle"),
			resendButton: localizationKeys("reverification.phoneCode.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__phoneNumber"),
			showAlternativeMethods: props.showAlternativeMethods
		})
	});
};

//#endregion
export { UVFactorOnePhoneCodeCard };
//# sourceMappingURL=UVFactorOnePhoneCodeCard.js.map