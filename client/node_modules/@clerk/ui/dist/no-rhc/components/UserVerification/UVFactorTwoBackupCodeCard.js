import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Col } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { useAfterVerification } from "./use-after-verification.js";
import React from "react";
import { useSession } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UVFactorTwoBackupCodeCard.tsx
const UVFactorTwoBackupCodeCard = (props) => {
	const { onShowAlternativeMethodsClicked } = props;
	const { session } = useSession();
	const { handleVerificationResponse } = useAfterVerification();
	const card = useCardState();
	const codeControl = useFormControl("code", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__backupCode"),
		isRequired: true
	});
	const handleBackupCodeSubmit = (e) => {
		e.preventDefault();
		return session.attemptSecondFactorVerification({
			strategy: "backup_code",
			code: codeControl.value
		}).then(handleVerificationResponse).catch((err) => handleError(err, [codeControl], card.setError));
	};
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsxs(Header.Root, { children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("reverification.backupCodeMfa.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("reverification.backupCodeMfa.subtitle") })] }),
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
export { UVFactorTwoBackupCodeCard };
//# sourceMappingURL=UVFactorTwoBackupCodeCard.js.map