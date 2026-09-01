import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Col } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { HavingTrouble } from "../SignIn/HavingTrouble.js";
import { useAfterVerification } from "./use-after-verification.js";
import React from "react";
import { useSession } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UserVerificationFactorOnePassword.tsx
function UserVerificationFactorOnePasswordCard(props) {
	const { onShowAlternativeMethodsClick } = props;
	const { session } = useSession();
	const { handleVerificationResponse } = useAfterVerification();
	const card = useCardState();
	const [showHavingTrouble, setShowHavingTrouble] = React.useState(false);
	const toggleHavingTrouble = React.useCallback(() => setShowHavingTrouble((s) => !s), [setShowHavingTrouble]);
	const passwordControl = useFormControl("password", "", {
		type: "password",
		label: localizationKeys("formFieldLabel__password"),
		placeholder: localizationKeys("formFieldInputPlaceholder__password")
	});
	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		return session?.attemptFirstFactorVerification({
			strategy: "password",
			password: passwordControl.value
		}).then(handleVerificationResponse).catch((err) => handleError(err, [passwordControl], card.setError));
	};
	if (showHavingTrouble) return /* @__PURE__ */ jsx(HavingTrouble, { onBackLinkClick: toggleHavingTrouble });
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "password",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, { children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("reverification.password.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("reverification.password.subtitle") })] }),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsxs(Col, {
				elementDescriptor: descriptors.main,
				gap: 4,
				children: [/* @__PURE__ */ jsxs(Form.Root, {
					onSubmit: handlePasswordSubmit,
					gap: 8,
					children: [/* @__PURE__ */ jsx(Form.ControlRow, {
						elementId: passwordControl.id,
						children: /* @__PURE__ */ jsx(Form.PasswordInput, {
							...passwordControl.props,
							autoFocus: true
						})
					}), /* @__PURE__ */ jsx(Form.SubmitButton, { hasArrow: true })]
				}), /* @__PURE__ */ jsx(Card.Action, {
					elementId: onShowAlternativeMethodsClick ? "alternativeMethods" : "havingTrouble",
					children: /* @__PURE__ */ jsx(Card.ActionLink, {
						localizationKey: localizationKeys(onShowAlternativeMethodsClick ? "reverification.password.actionLink" : "reverification.alternativeMethods.actionLink"),
						onClick: onShowAlternativeMethodsClick || toggleHavingTrouble
					})
				})]
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
}

//#endregion
export { UserVerificationFactorOnePasswordCard };
//# sourceMappingURL=UserVerificationFactorOnePassword.js.map