import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { UVFactorTwoCodeForm } from "./UVFactorTwoCodeForm.js";
import { useSession } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UVFactorTwoPhoneCodeCard.tsx
const UVFactorTwoPhoneCodeCard = (props) => {
	const { session } = useSession();
	const prepare = () => {
		const { phoneNumberId, strategy } = props.factor;
		return session.prepareSecondFactorVerification({
			phoneNumberId,
			strategy
		});
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "phoneCode2Fa",
		children: /* @__PURE__ */ jsx(UVFactorTwoCodeForm, {
			...props,
			cardTitle: localizationKeys("reverification.phoneCodeMfa.title"),
			cardSubtitle: localizationKeys("reverification.phoneCodeMfa.subtitle"),
			inputLabel: localizationKeys("reverification.phoneCodeMfa.formTitle"),
			resendButton: localizationKeys("reverification.phoneCodeMfa.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__phoneNumber"),
			prepare
		})
	});
};

//#endregion
export { UVFactorTwoPhoneCodeCard };
//# sourceMappingURL=UVFactorTwoPhoneCodeCard.js.map