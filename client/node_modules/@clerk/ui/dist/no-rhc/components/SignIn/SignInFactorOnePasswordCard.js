import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Flex } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { IdentityPreview } from "../../elements/IdentityPreview.js";
import { useSupportEmail } from "../../hooks/useSupportEmail.js";
import { navigateOnSignInProtectGate } from "./handleProtectCheck.js";
import { HavingTrouble } from "./HavingTrouble.js";
import { useResetPasswordFactor } from "./useResetPasswordFactor.js";
import { isPasswordCompromisedError, isPasswordPwnedError, isUserLockedError } from "@clerk/shared/error";
import { clerkInvalidFAPIResponse } from "@clerk/shared/internal/clerk-js/errors";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorOnePasswordCard.tsx
const usePasswordControl = (props) => {
	const { onForgotPasswordMethodClick, onShowAlternativeMethodsClick } = props;
	const resetPasswordFactor = useResetPasswordFactor();
	const passwordControl = useFormControl("password", "", {
		type: "password",
		label: localizationKeys("formFieldLabel__password"),
		placeholder: localizationKeys("formFieldInputPlaceholder__password")
	});
	return {
		...passwordControl,
		props: {
			...passwordControl.props,
			actionLabel: resetPasswordFactor || onShowAlternativeMethodsClick ? localizationKeys("formFieldAction__forgotPassword") : "",
			onActionClicked: onForgotPasswordMethodClick ? onForgotPasswordMethodClick : onShowAlternativeMethodsClick ? onShowAlternativeMethodsClick : () => null
		}
	};
};
const SignInFactorOnePasswordCard = (props) => {
	const { onShowAlternativeMethodsClick, onPasswordError } = props;
	const passwordInputRef = React.useRef(null);
	const card = useCardState();
	const { setActive } = useClerk();
	const signIn = useCoreSignIn();
	const { afterSignInUrl, navigateOnSetActive } = useSignInContext();
	const supportEmail = useSupportEmail();
	const passwordControl = usePasswordControl(props);
	const { navigate } = useRouter();
	const [showHavingTrouble, setShowHavingTrouble] = React.useState(false);
	const toggleHavingTrouble = React.useCallback(() => setShowHavingTrouble((s) => !s), [setShowHavingTrouble]);
	const clerk = useClerk();
	const goBack = () => {
		navigate("../");
	};
	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		signIn.attemptFirstFactor({
			strategy: "password",
			password: passwordControl.value
		}).then((res) => {
			if (navigateOnSignInProtectGate(res, navigate, "../protect-check")) return;
			switch (res.status) {
				case "complete": return setActive({
					session: res.createdSessionId,
					navigate: ({ session, decorateUrl }) => {
						return navigateOnSetActive({
							session,
							redirectUrl: afterSignInUrl,
							decorateUrl
						});
					}
				});
				case "needs_second_factor": return navigate("../factor-two");
				case "needs_client_trust": return navigate("../client-trust");
				default: return console.error(clerkInvalidFAPIResponse(res.status, supportEmail));
			}
		}).catch((err) => {
			if (isUserLockedError(err)) return clerk.__internal_navigateWithError("..", err.errors[0]);
			if (onPasswordError) {
				if (isPasswordPwnedError(err)) {
					card.setError({
						...err.errors[0],
						code: "form_password_pwned__sign_in"
					});
					onPasswordError("pwned");
					return;
				}
				if (isPasswordCompromisedError(err)) {
					card.setError({
						...err.errors[0],
						code: "form_password_compromised__sign_in"
					});
					onPasswordError("compromised");
					return;
				}
			}
			handleError(err, [passwordControl], card.setError);
			setTimeout(() => passwordInputRef.current?.focus(), 0);
		});
	};
	if (showHavingTrouble) return /* @__PURE__ */ jsx(HavingTrouble, { onBackLinkClick: toggleHavingTrouble });
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "password",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [
					/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.password.title") }),
					/* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("signIn.password.subtitle") }),
					/* @__PURE__ */ jsx(IdentityPreview, {
						identifier: signIn.identifier,
						avatarUrl: signIn.userData.imageUrl,
						onClick: goBack,
						editButtonAriaLabel: localizationKeys("identityPreviewEditButton__identifier")
					})
				]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsxs(Flex, {
				direction: "col",
				elementDescriptor: descriptors.main,
				gap: 4,
				children: [/* @__PURE__ */ jsxs(Form.Root, {
					onSubmit: handlePasswordSubmit,
					gap: 8,
					children: [
						/* @__PURE__ */ jsx("input", {
							readOnly: true,
							id: "identifier-field",
							name: "identifier",
							value: signIn.identifier || "",
							style: { display: "none" }
						}),
						/* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: passwordControl.id,
							children: /* @__PURE__ */ jsx(Form.PasswordInput, {
								...passwordControl.props,
								ref: passwordInputRef,
								autoFocus: true
							})
						}),
						/* @__PURE__ */ jsx(Form.SubmitButton, { hasArrow: true })
					]
				}), /* @__PURE__ */ jsx(Card.Action, {
					elementId: onShowAlternativeMethodsClick ? "alternativeMethods" : "havingTrouble",
					children: /* @__PURE__ */ jsx(Card.ActionLink, {
						localizationKey: localizationKeys(onShowAlternativeMethodsClick ? "signIn.password.actionLink" : "signIn.alternativeMethods.actionLink"),
						onClick: onShowAlternativeMethodsClick || toggleHavingTrouble
					})
				})]
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};

//#endregion
export { SignInFactorOnePasswordCard };
//# sourceMappingURL=SignInFactorOnePasswordCard.js.map