import { localizationKeys } from "../../../../../../localization/localizationKeys.js";
import SvgCheckmark from "../../../../../../icons/checkmark.js";
import SvgClipboard from "../../../../../../icons/clipboard.js";
import { useFormControl } from "../../../../../../utils/useFormControl.js";
import { descriptors } from "../../../../../../customizables/elementDescriptors.js";
import { Badge, Col, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "../../../../../../customizables/index.js";
import { Form } from "../../../../../../elements/Form.js";
import { ClipboardInput } from "../../../../../../elements/ClipboardInput.js";
import { useConfigureSSO } from "../../../../ConfigureSSOContext.js";
import { Step } from "../../../../elements/Step.js";
import { useWizard } from "../../../../elements/Wizard/WizardContext.js";
import { InnerStepCounter } from "../../../../elements/Wizard/InnerStepCounter.js";
import "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/ConfigureStep/oidc/shared/OidcRedirectUriStep.tsx
const OIDC_CLAIM_ROWS = [
	{
		id: "subject",
		claim: "sub",
		isRequired: true
	},
	{
		id: "email",
		claim: "email",
		isRequired: true
	},
	{
		id: "firstName",
		claim: "given_name",
		isRequired: false
	},
	{
		id: "lastName",
		claim: "family_name",
		isRequired: false
	}
];
const OidcClaimsTable = () => /* @__PURE__ */ jsxs(Table, {
	elementDescriptor: descriptors.configureSSOAttributeMappingTable,
	sx: (theme) => ({ "tr > th:first-of-type": { paddingInlineStart: theme.space.$4 } }),
	children: [/* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [/* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Text, {
		sx: (theme) => ({ fontSize: theme.fontSizes.$xs }),
		localizationKey: localizationKeys("configureSSO.configureStep.oidcCustom.redirectUriStep.claims.table.columns.claim")
	}) }), /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Text, {
		sx: (theme) => ({ fontSize: theme.fontSizes.$xs }),
		localizationKey: localizationKeys("configureSSO.configureStep.oidcCustom.redirectUriStep.claims.table.columns.attribute")
	}) })] }) }), /* @__PURE__ */ jsx(Tbody, { children: OIDC_CLAIM_ROWS.map((row) => /* @__PURE__ */ jsxs(Tr, { children: [/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Flex, {
		as: "span",
		align: "center",
		sx: (theme) => ({ gap: theme.space.$2 }),
		children: [/* @__PURE__ */ jsx(Text, {
			as: "code",
			colorScheme: "secondary",
			sx: { fontFamily: "monospace" },
			children: row.claim
		}), /* @__PURE__ */ jsx(Badge, {
			elementDescriptor: descriptors.configureSSOAttributeMappingBadge,
			elementId: descriptors.configureSSOAttributeMappingBadge.setId(row.isRequired ? "required" : "optional"),
			colorScheme: row.isRequired ? "warning" : "primary",
			localizationKey: localizationKeys(row.isRequired ? "configureSSO.configureStep.attributeMappingTable.badges.required" : "configureSSO.configureStep.attributeMappingTable.badges.optional")
		})]
	}) }), /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Text, {
		as: "span",
		localizationKey: localizationKeys(`configureSSO.configureStep.oidcCustom.redirectUriStep.claims.table.rows.${row.id}.attribute`)
	}) })] }, row.id)) })]
});
const OidcRedirectUriStep = () => {
	const { goNext, goPrev, isFirstStep, isLastStep } = useWizard();
	const { enterpriseConnection } = useConfigureSSO();
	const redirectUri = enterpriseConnection?.oauthConfig?.redirectUri ?? "";
	const redirectUriField = useFormControl("redirectUri", redirectUri, {
		type: "text",
		label: localizationKeys("configureSSO.configureStep.oidcCustom.redirectUriStep.redirectUri.label"),
		isRequired: false
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(Step.Header, {
			title: localizationKeys("configureSSO.configureStep.oidcCustom.mainHeaderTitle"),
			description: localizationKeys("configureSSO.configureStep.oidcCustom.redirectUriStep.headerSubtitle"),
			children: /* @__PURE__ */ jsx(InnerStepCounter, {})
		}),
		/* @__PURE__ */ jsx(Step.Body, { children: /* @__PURE__ */ jsxs(Step.Section, {
			sx: (theme) => ({ gap: theme.space.$5 }),
			children: [
				/* @__PURE__ */ jsx(Col, {
					sx: (theme) => ({ gap: theme.space.$1x5 }),
					children: /* @__PURE__ */ jsx(Text, {
						as: "p",
						colorScheme: "secondary",
						localizationKey: localizationKeys("configureSSO.configureStep.oidcCustom.redirectUriStep.paragraph")
					})
				}),
				/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: redirectUriField.id,
					children: /* @__PURE__ */ jsx(Form.CommonInputWrapper, {
						...redirectUriField.props,
						children: /* @__PURE__ */ jsx(ClipboardInput, {
							value: redirectUri,
							readOnly: true,
							copyIcon: SvgClipboard,
							copiedIcon: SvgCheckmark
						})
					})
				}),
				/* @__PURE__ */ jsxs(Col, {
					sx: (theme) => ({ gap: theme.space.$3 }),
					children: [/* @__PURE__ */ jsx(Text, {
						as: "p",
						colorScheme: "secondary",
						localizationKey: localizationKeys("configureSSO.configureStep.oidcCustom.redirectUriStep.claims.description")
					}), /* @__PURE__ */ jsx(OidcClaimsTable, {})]
				})
			]
		}) }),
		/* @__PURE__ */ jsxs(Step.Footer, { children: [
			/* @__PURE__ */ jsx(Step.Footer.Reset, {}),
			/* @__PURE__ */ jsx(Step.Footer.Previous, {
				onClick: () => goPrev(),
				isDisabled: isFirstStep
			}),
			/* @__PURE__ */ jsx(Step.Footer.Continue, {
				onClick: () => goNext(),
				isDisabled: isLastStep
			})
		] })
	] });
};

//#endregion
export { OidcRedirectUriStep };
//# sourceMappingURL=OidcRedirectUriStep.js.map