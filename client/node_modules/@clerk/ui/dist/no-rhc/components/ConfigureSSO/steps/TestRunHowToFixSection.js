import { localizationKeys } from "../../../localization/localizationKeys.js";
import SvgArrowRight from "../../../icons/arrow-right.js";
import { descriptors } from "../../../customizables/elementDescriptors.js";
import { Box, Flex, Heading, Icon, Link, Span, Text } from "../../../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/TestRunHowToFixSection.tsx
const DOCS_BASE_URL = "https://clerk.com/docs/guides/organizations/add-members/sso";
const HOW_TO_FIX_BY_ERROR_CODE = {
	saml_user_attribute_missing: {
		kind: "steps",
		introKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.saml_user_attribute_missing.intro"),
		stepKeys: [
			localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.saml_user_attribute_missing.step1"),
			localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.saml_user_attribute_missing.step2"),
			localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.saml_user_attribute_missing.step3")
		]
	},
	saml_response_relaystate_missing: {
		kind: "description",
		descriptionKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.saml_response_relaystate_missing.description")
	},
	saml_email_address_domain_mismatch: {
		kind: "description",
		descriptionKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.saml_email_address_domain_mismatch.description")
	},
	oauth_access_denied: {
		kind: "description",
		descriptionKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.oauth_access_denied.description")
	},
	oauth_token_exchange_error: {
		kind: "description",
		descriptionKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.oauth_token_exchange_error.description")
	},
	oauth_fetch_user_error: {
		kind: "steps",
		introKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.oauth_fetch_user_error.intro"),
		stepKeys: [localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.oauth_fetch_user_error.step1"), localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.oauth_fetch_user_error.step2")]
	}
};
const TestRunHowToFixSection = ({ errorCode }) => {
	if (!errorCode) return null;
	const content = HOW_TO_FIX_BY_ERROR_CODE[errorCode];
	if (!content) return null;
	const docsHref = `${DOCS_BASE_URL}#${errorCode.replaceAll("_", "-")}`;
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.configureSSOTestRunHowToFixSection,
		direction: "col",
		gap: 3,
		sx: (t) => ({
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100,
			paddingTop: t.space.$4
		}),
		children: [/* @__PURE__ */ jsx(Heading, {
			as: "h3",
			textVariant: "h3",
			localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.sectionTitle")
		}), /* @__PURE__ */ jsxs(Box, {
			sx: (t) => ({
				padding: t.space.$3,
				backgroundColor: t.colors.$colorBackground,
				borderWidth: t.borderWidths.$normal,
				borderStyle: t.borderStyles.$solid,
				borderColor: t.colors.$borderAlpha150,
				borderRadius: t.radii.$md,
				boxShadow: t.shadows.$cardContentShadow
			}),
			children: [/* @__PURE__ */ jsx(HowToFixContent, { content }), /* @__PURE__ */ jsxs(Link, {
				elementDescriptor: descriptors.configureSSOTestRunHowToFixDocsLink,
				href: docsHref,
				target: "_blank",
				rel: "noopener noreferrer",
				sx: (t) => ({
					alignSelf: "flex-start",
					display: "inline-flex",
					alignItems: "center",
					gap: t.space.$1x5,
					paddingBlock: t.space.$1,
					paddingInline: t.space.$3,
					borderRadius: t.radii.$md,
					borderWidth: t.borderWidths.$normal,
					borderStyle: t.borderStyles.$solid,
					borderColor: t.colors.$borderAlpha150,
					color: t.colors.$colorForeground,
					fontSize: t.fontSizes.$sm,
					fontWeight: t.fontWeights.$medium,
					textDecoration: "none",
					marginTop: t.space.$2,
					"&:hover": {
						backgroundColor: t.colors.$neutralAlpha50,
						textDecoration: "none"
					}
				}),
				children: [/* @__PURE__ */ jsx(Span, { localizationKey: localizationKeys("configureSSO.testConfigurationStep.testRunDetails.howToFix.actionLabel__viewDocumentation") }), /* @__PURE__ */ jsx(Icon, {
					icon: SvgArrowRight,
					size: "sm"
				})]
			})]
		})]
	});
};
const HowToFixContent = ({ content }) => {
	if (content.kind === "description") return /* @__PURE__ */ jsx(Text, {
		colorScheme: "secondary",
		localizationKey: content.descriptionKey
	});
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		gap: 2,
		children: [content.introKey ? /* @__PURE__ */ jsx(Text, {
			colorScheme: "secondary",
			localizationKey: content.introKey
		}) : null, /* @__PURE__ */ jsx(Box, {
			as: "ol",
			sx: (t) => ({
				margin: 0,
				paddingInlineStart: t.space.$5,
				listStyleType: "decimal",
				display: "flex",
				flexDirection: "column",
				gap: t.space.$1
			}),
			children: content.stepKeys.map((stepKey) => /* @__PURE__ */ jsx(Box, {
				as: "li",
				sx: (t) => ({
					color: t.colors.$colorMutedForeground,
					fontSize: t.fontSizes.$sm,
					"&::marker": {
						color: t.colors.$colorMutedForeground,
						fontSize: t.fontSizes.$sm
					}
				}),
				children: /* @__PURE__ */ jsx(Text, {
					as: "span",
					colorScheme: "secondary",
					localizationKey: stepKey
				})
			}, stepKey.key))
		})]
	});
};

//#endregion
export { TestRunHowToFixSection };
//# sourceMappingURL=TestRunHowToFixSection.js.map