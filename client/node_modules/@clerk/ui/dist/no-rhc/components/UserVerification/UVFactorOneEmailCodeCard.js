import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { UVFactorOneCodeForm } from "./UVFactorOneCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UVFactorOneEmailCodeCard.tsx
const UVFactorOneEmailCodeCard = (props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailCode",
		children: /* @__PURE__ */ jsx(UVFactorOneCodeForm, {
			...props,
			cardTitle: localizationKeys("reverification.emailCode.title"),
			cardSubtitle: localizationKeys("reverification.emailCode.subtitle"),
			inputLabel: localizationKeys("reverification.emailCode.formTitle"),
			resendButton: localizationKeys("reverification.emailCode.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__emailAddress")
		})
	});
};

//#endregion
export { UVFactorOneEmailCodeCard };
//# sourceMappingURL=UVFactorOneEmailCodeCard.js.map