import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Button, Col } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { useAfterVerification } from "./use-after-verification.js";
import React from "react";
import { useClerk, useSession } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/UVFactorOnePasskeysCard.tsx
const UVFactorOnePasskeysCard = (props) => {
	const { onShowAlternativeMethodsClicked } = props;
	const { session } = useSession();
	const { __internal_isWebAuthnSupported } = useClerk();
	const { handleVerificationResponse } = useAfterVerification();
	const card = useCardState();
	const handlePasskeysAttempt = () => {
		session?.verifyWithPasskey().then((response) => {
			return handleVerificationResponse(response);
		}).catch((err) => handleError(err, [], card.setError));
	};
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsxs(Header.Root, { children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("reverification.passkey.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("reverification.passkey.subtitle") })] }),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.main,
			gap: 8,
			children: /* @__PURE__ */ jsx(Form.Root, { children: /* @__PURE__ */ jsxs(Col, {
				gap: 3,
				children: [/* @__PURE__ */ jsx(Button, {
					type: "button",
					onClick: (e) => {
						e.preventDefault();
						handlePasskeysAttempt();
					},
					localizationKey: localizationKeys("reverification.passkey.blockButton__passkey"),
					hasArrow: true
				}), /* @__PURE__ */ jsx(Card.Action, {
					elementId: "alternativeMethods",
					children: onShowAlternativeMethodsClicked && /* @__PURE__ */ jsx(Card.ActionLink, {
						localizationKey: localizationKeys("footerActionLink__useAnotherMethod"),
						onClick: onShowAlternativeMethodsClicked
					})
				})]
			}) })
		})
	] }), /* @__PURE__ */ jsx(Card.Footer, {})] });
};

//#endregion
export { UVFactorOnePasskeysCard };
//# sourceMappingURL=UVFactorOnePasskeysCard.js.map