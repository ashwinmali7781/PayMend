import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Col } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { useSupportEmail } from "../../hooks/useSupportEmail.js";
import { navigateOnSignInProtectGate } from "./handleProtectCheck.js";
import { isResetPasswordStrategy } from "./utils.js";
import { isUserLockedError } from "@clerk/shared/error";
import { clerkInvalidFAPIResponse } from "@clerk/shared/internal/clerk-js/errors";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwoBackupCodeCard.tsx
const SignInFactorTwoBackupCodeCard = (props) => {
	const { onShowAlternativeMethodsClicked } = props;
	const signIn = useCoreSignIn();
	const { afterSignInUrl, navigateOnSetActive } = useSignInContext();
	const { setActive } = useClerk();
	const { navigate } = useRouter();
	const supportEmail = useSupportEmail();
	const card = useCardState();
	const codeControl = useFormControl("code", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__backupCode"),
		isRequired: true
	});
	const clerk = useClerk();
	const isResettingPassword = (resource) => isResetPasswordStrategy(resource.firstFactorVerification?.strategy) && resource.firstFactorVerification?.status === "verified";
	const handleBackupCodeSubmit = (e) => {
		e.preventDefault();
		return signIn.attemptSecondFactor({
			strategy: "backup_code",
			code: codeControl.value
		}).then((res) => {
			if (navigateOnSignInProtectGate(res, navigate, "../protect-check")) return;
			switch (res.status) {
				case "complete":
					if (isResettingPassword(res) && res.createdSessionId) {
						const queryParams = new URLSearchParams();
						queryParams.set("createdSessionId", res.createdSessionId);
						return navigate(`../reset-password-success?${queryParams.toString()}`);
					}
					return setActive({
						session: res.createdSessionId,
						navigate: async ({ session, decorateUrl }) => {
							await navigateOnSetActive({
								session,
								redirectUrl: afterSignInUrl,
								decorateUrl
							});
						}
					});
				default: return console.error(clerkInvalidFAPIResponse(res.status, supportEmail));
			}
		}).catch((err) => {
			if (isUserLockedError(err)) return clerk.__internal_navigateWithError("..", err.errors[0]);
			handleError(err, [codeControl], card.setError);
		});
	};
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			showLogo: true,
			children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.backupCodeMfa.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: isResettingPassword(signIn) ? localizationKeys("signIn.forgotPassword.subtitle") : localizationKeys("signIn.backupCodeMfa.subtitle") })]
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.main,
			gap: 8,
			children: /* @__PURE__ */ jsxs(Form.Root, {
				onSubmit: handleBackupCodeSubmit,
				children: [/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: codeControl.id,
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...codeControl.props,
						autoFocus: true,
						onActionClicked: onShowAlternativeMethodsClicked
					})
				}), /* @__PURE__ */ jsxs(Col, {
					gap: 3,
					children: [/* @__PURE__ */ jsx(Form.SubmitButton, { hasArrow: true }), /* @__PURE__ */ jsx(Card.Action, {
						elementId: "alternativeMethods",
						children: onShowAlternativeMethodsClicked && /* @__PURE__ */ jsx(Card.ActionLink, {
							localizationKey: localizationKeys("footerActionLink__useAnotherMethod"),
							onClick: onShowAlternativeMethodsClicked
						})
					})]
				})]
			})
		})
	] }), /* @__PURE__ */ jsx(Card.Footer, {})] });
};

//#endregion
export { SignInFactorTwoBackupCodeCard };
//# sourceMappingURL=SignInFactorTwoBackupCodeCard.js.map