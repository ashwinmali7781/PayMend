import { useEmailLink } from "../../hooks/useEmailLink.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { buildVerificationRedirectUrl } from "../../common/redirects.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Button } from "../../customizables/index.js";
import { EmailLinkStatusCard } from "../../common/EmailLinkStatusCard.js";
import { handleError } from "../../utils/errorHandler.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { VerificationLink } from "../../elements/VerificationLinkCard.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/VerifyWithLink.tsx
const VerifyWithLink = (props) => {
	const { email, nextStep, onReset } = props;
	const card = useCardState();
	const profileContext = useUserProfileContext();
	const { startEmailLinkFlow } = useEmailLink(email);
	const { displayConfig } = useEnvironment();
	React.useEffect(() => {
		startVerification();
	}, []);
	function startVerification() {
		/**
		* The following workaround is used in order to make magic links work when the
		* <UserProfile/> is used as a modal. In modals, the routing is virtual. For
		* magic links the flow needs to end by invoking the /verify path of the <UserProfile/>
		* that renders the <VerificationSuccessPage/>. So, we use the userProfileUrl that
		* defaults to Clerk Hosted Pages /user as a fallback.
		*/
		const { routing } = profileContext;
		startEmailLinkFlow({ redirectUrl: buildVerificationRedirectUrl({
			ctx: profileContext,
			baseUrl: routing === "virtual" ? displayConfig.userProfileUrl : "",
			intent: "profile"
		}) }).then(() => nextStep()).catch((err) => handleError(err, [], card.setError));
	}
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(VerificationLink, {
		resendButton: localizationKeys("userProfile.emailAddressPage.emailLink.resendButton"),
		onResendCodeClicked: startVerification
	}), /* @__PURE__ */ jsx(FormButtonContainer, { children: /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		localizationKey: localizationKeys("userProfile.formButtonReset"),
		elementDescriptor: descriptors.formButtonReset,
		onClick: onReset
	}) })] });
};
const VerificationSuccessPage = () => {
	return /* @__PURE__ */ jsx(EmailLinkStatusCard, {
		title: localizationKeys("signUp.emailLink.verifiedSwitchTab.title"),
		subtitle: localizationKeys("signUp.emailLink.verifiedSwitchTab.subtitle"),
		status: "verified"
	});
};

//#endregion
export { VerificationSuccessPage, VerifyWithLink };
//# sourceMappingURL=VerifyWithLink.js.map