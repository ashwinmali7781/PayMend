import { useCardState } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { VerificationCodeCard } from "../../elements/VerificationCodeCard.js";
import { useAfterVerification } from "./use-after-verification.js";
import React from "react";
import { useSession } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UVFactorTwoCodeForm.tsx
const UVFactorTwoCodeForm = (props) => {
	const card = useCardState();
	const { session } = useSession();
	const { handleVerificationResponse } = useAfterVerification();
	React.useEffect(() => {
		if (props.factorAlreadyPrepared) return;
		prepare?.();
	}, []);
	const prepare = props.prepare ? () => props.prepare?.().then(() => props.onFactorPrepare()).catch((err) => handleError(err, [], card.setError)) : void 0;
	const action = (code, resolve, reject) => {
		session.attemptSecondFactorVerification({
			strategy: props.factor.strategy,
			code
		}).then(async (res) => {
			await resolve();
			return handleVerificationResponse(res);
		}).catch(reject);
	};
	return /* @__PURE__ */ jsx(VerificationCodeCard, {
		cardTitle: props.cardTitle,
		cardSubtitle: props.cardSubtitle,
		resendButton: props.resendButton,
		inputLabel: props.inputLabel,
		onCodeEntryFinishedAction: action,
		onResendCodeClicked: prepare,
		safeIdentifier: "safeIdentifier" in props.factor ? props.factor.safeIdentifier : void 0,
		profileImageUrl: session?.user?.imageUrl,
		identityPreviewEditButtonAriaLabel: props.identityPreviewEditButtonAriaLabel,
		onShowAlternativeMethodsClicked: props.onShowAlternativeMethodsClicked,
		showAlternativeMethods: props.showAlternativeMethods
	});
};

//#endregion
export { UVFactorTwoCodeForm };
//# sourceMappingURL=UVFactorTwoCodeForm.js.map