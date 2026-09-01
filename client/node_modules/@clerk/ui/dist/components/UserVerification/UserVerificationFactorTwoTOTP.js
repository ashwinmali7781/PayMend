import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { UVFactorTwoCodeForm } from "./UVFactorTwoCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UserVerificationFactorTwoTOTP.tsx
function UserVerificationFactorTwoTOTP(props) {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "totp2Fa",
		children: /* @__PURE__ */ jsx(UVFactorTwoCodeForm, {
			...props,
			cardTitle: localizationKeys("reverification.totpMfa.title"),
			cardSubtitle: localizationKeys("reverification.totpMfa.subtitle"),
			inputLabel: localizationKeys("reverification.totpMfa.formTitle"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__identifier"),
			showAlternativeMethods: props.showAlternativeMethods
		})
	});
}

//#endregion
export { UserVerificationFactorTwoTOTP };
//# sourceMappingURL=UserVerificationFactorTwoTOTP.js.map