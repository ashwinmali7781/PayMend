import { useCardState } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { VerificationCodeCard } from "../../elements/VerificationCodeCard.js";
import { useAfterVerification } from "./use-after-verification.js";
import React from "react";
import { useSession } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UVFactorOneCodeForm.tsx
const UVFactorOneCodeForm = (props) => {
	const { session } = useSession();
	const card = useCardState();
	const { handleVerificationResponse } = useAfterVerification();
	React.useEffect(() => {
		if (!props.factorAlreadyPrepared) prepare();
	}, []);
	const prepare = () => {
		session.prepareFirstFactorVerification(props.factor).then(() => props.onFactorPrepare()).catch((err) => handleError(err, [], card.setError));
	};
	const action = (code, resolve, reject) => {
		session.attemptFirstFactorVerification({
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
		inputLabel: props.inputLabel,
		resendButton: props.resendButton,
		onCodeEntryFinishedAction: action,
		onResendCodeClicked: prepare,
		safeIdentifier: props.factor.safeIdentifier,
		profileImageUrl: session?.user?.imageUrl,
		identityPreviewEditButtonAriaLabel: props.identityPreviewEditButtonAriaLabel,
		onShowAlternativeMethodsClicked: props.onShowAlternativeMethodsClicked,
		showAlternativeMethods: props.showAlternativeMethods,
		onBackLinkClicked: props.onBackLinkClicked
	});
};

//#endregion
export { UVFactorOneCodeForm };
//# sourceMappingURL=UVFactorOneCodeForm.js.map