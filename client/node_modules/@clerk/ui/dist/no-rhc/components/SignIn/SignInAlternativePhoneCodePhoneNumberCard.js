import { useEnabledThirdPartyProviders } from "../../hooks/useEnabledThirdPartyProviders.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Button, Col, Flex } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { ProviderIcon } from "../../common/ProviderIcon.js";
import { Form } from "../../elements/Form.js";
import { CaptchaElement } from "../../elements/CaptchaElement.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInAlternativePhoneCodePhoneNumberCard.tsx
const SignInAlternativePhoneCodePhoneNumberCard = (props) => {
	const { handleSubmit, phoneNumberFormState, onUseAnotherMethod, phoneCodeProvider } = props;
	const { providerToDisplayData, strategyToDisplayData } = useEnabledThirdPartyProviders();
	const provider = phoneCodeProvider.name;
	const channel = phoneCodeProvider.channel;
	const card = useCardState();
	const strategyData = strategyToDisplayData[channel];
	return /* @__PURE__ */ jsx(Card.Root, { children: /* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			showLogo: true,
			showDivider: true,
			children: [
				/* @__PURE__ */ jsx(Col, {
					center: true,
					children: providerToDisplayData[channel] && /* @__PURE__ */ jsx(ProviderIcon, {
						id: channel,
						iconUrl: providerToDisplayData[channel].iconUrl,
						name: strategyData?.name || channel || provider,
						alt: `${strategyData?.name || channel || provider} logo`,
						size: "$7",
						sx: (theme) => ({ marginBottom: theme.sizes.$6 })
					})
				}),
				/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.start.alternativePhoneCodeProvider.title", { provider }) }),
				/* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("signIn.start.alternativePhoneCodeProvider.subtitle", { provider }) })
			]
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsx(Flex, {
			direction: "col",
			elementDescriptor: descriptors.main,
			gap: 6,
			children: /* @__PURE__ */ jsxs(Form.Root, {
				onSubmit: handleSubmit,
				gap: 8,
				children: [
					/* @__PURE__ */ jsx(Col, {
						gap: 6,
						children: /* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: "phoneNumber",
							children: /* @__PURE__ */ jsx(Form.PhoneInput, {
								...phoneNumberFormState.props,
								label: localizationKeys("signIn.start.alternativePhoneCodeProvider.label", { provider }),
								isRequired: true,
								isOptional: false,
								actionLabel: void 0,
								onActionClicked: void 0
							})
						})
					}),
					/* @__PURE__ */ jsxs(Col, {
						center: true,
						children: [/* @__PURE__ */ jsx(CaptchaElement, {}), /* @__PURE__ */ jsx(Col, {
							gap: 6,
							sx: { width: "100%" },
							children: /* @__PURE__ */ jsx(Form.SubmitButton, {
								hasArrow: true,
								localizationKey: localizationKeys("formButtonPrimary")
							})
						})]
					}),
					/* @__PURE__ */ jsx(Col, {
						center: true,
						children: /* @__PURE__ */ jsx(Button, {
							variant: "link",
							colorScheme: "neutral",
							onClick: onUseAnotherMethod,
							localizationKey: localizationKeys("signIn.start.alternativePhoneCodeProvider.actionLink")
						})
					})
				]
			})
		})
	] }) });
};

//#endregion
export { SignInAlternativePhoneCodePhoneNumberCard };
//# sourceMappingURL=SignInAlternativePhoneCodePhoneNumberCard.js.map