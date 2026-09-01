import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgBlock from "../../icons/block.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Button, Flex, Icon } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { useSupportEmail } from "../../hooks/useSupportEmail.js";
import { SIGN_UP_MODES } from "@clerk/shared/internal/clerk-js/constants";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpRestrictedAccess.tsx
const SignUpRestrictedAccess = () => {
	const clerk = useClerk();
	const card = useCardState();
	const { navigate } = useRouter();
	const { signInUrl, waitlistUrl } = useSignUpContext();
	const supportEmail = useSupportEmail();
	const { userSettings } = useEnvironment();
	const { mode } = userSettings.signUp;
	const handleEmailSupport = () => {
		window.location.href = `mailto:${supportEmail}`;
	};
	const handleWaitlistNavigate = async () => {
		await navigate(clerk.buildUrlWithAuth(waitlistUrl));
	};
	const subtitle = mode === SIGN_UP_MODES.RESTRICTED ? localizationKeys("signUp.restrictedAccess.subtitle") : localizationKeys("signUp.restrictedAccess.subtitleWaitlist");
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			showLogo: true,
			children: [
				/* @__PURE__ */ jsx(Icon, {
					icon: SvgBlock,
					sx: (t) => ({
						margin: "auto",
						width: t.sizes.$10,
						height: t.sizes.$10
					})
				}),
				/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signUp.restrictedAccess.title") }),
				/* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: subtitle })
			]
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		mode === SIGN_UP_MODES.RESTRICTED && supportEmail && /* @__PURE__ */ jsx(Flex, {
			direction: "col",
			gap: 4,
			children: /* @__PURE__ */ jsx(Button, {
				localizationKey: localizationKeys("signUp.restrictedAccess.blockButton__emailSupport"),
				onClick: handleEmailSupport
			})
		}),
		mode === SIGN_UP_MODES.WAITLIST && /* @__PURE__ */ jsx(Flex, {
			direction: "col",
			gap: 4,
			children: /* @__PURE__ */ jsx(Button, {
				localizationKey: localizationKeys("signUp.restrictedAccess.blockButton__joinWaitlist"),
				onClick: handleWaitlistNavigate
			})
		})
	] }), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsxs(Card.Action, {
		elementId: "signUp",
		children: [/* @__PURE__ */ jsx(Card.ActionText, { localizationKey: localizationKeys("signUp.restrictedAccess.actionText") }), /* @__PURE__ */ jsx(Card.ActionLink, {
			localizationKey: localizationKeys("signUp.restrictedAccess.actionLink"),
			to: clerk.buildUrlWithAuth(signInUrl)
		})]
	}) })] });
};

//#endregion
export { SignUpRestrictedAccess };
//# sourceMappingURL=SignUpRestrictedAccess.js.map