import { useRouter } from "../../router/RouteContext.js";
import { useEnterpriseSSOLink } from "../../hooks/useEnterpriseSSOLink.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Button, Flex } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import React from "react";
import { appendModalState } from "@clerk/shared/internal/clerk-js/queryStateParams";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/VerifyWithEnterpriseConnection.tsx
const VerifyWithEnterpriseConnection = (props) => {
	const { navigate } = useRouter();
	const { email, nextStep, onReset } = props;
	const card = useCardState();
	const profileContext = useUserProfileContext();
	const { startEnterpriseSSOLinkFlow } = useEnterpriseSSOLink(email);
	React.useEffect(() => {
		startVerification();
	}, []);
	function startVerification() {
		const { mode, componentName } = profileContext;
		startEnterpriseSSOLinkFlow({ redirectUrl: mode === "modal" ? appendModalState({
			url: window.location.href,
			componentName
		}) : window.location.href }).then(() => nextStep()).catch((err) => handleError(err, [], card.setError));
	}
	async function handleClick() {
		await navigate(email.verification.externalVerificationRedirectURL?.href || "");
	}
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Flex, {
		justify: "center",
		children: /* @__PURE__ */ jsx(Button, {
			variant: "link",
			onClick: handleClick,
			localizationKey: localizationKeys("userProfile.emailAddressPage.enterpriseSSOLink.formButton")
		})
	}), /* @__PURE__ */ jsx(FormButtonContainer, { children: /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		localizationKey: localizationKeys("userProfile.formButtonReset"),
		elementDescriptor: descriptors.formButtonReset,
		onClick: onReset
	}) })] });
};

//#endregion
export { VerifyWithEnterpriseConnection };
//# sourceMappingURL=VerifyWithEnterpriseConnection.js.map