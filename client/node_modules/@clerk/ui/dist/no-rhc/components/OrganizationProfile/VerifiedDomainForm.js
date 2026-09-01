import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { useFetch } from "../../hooks/useFetch.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgInformationCircle from "../../icons/information-circle.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Col, Flex, Spinner, Text } from "../../customizables/index.js";
import { CalloutWithAction } from "../../common/CalloutWithAction.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { useEffect } from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/VerifiedDomainForm.tsx
const useCalloutLabel = (domain, { infoLabel: infoLabelKey }) => {
	const totalInvitations = domain?.totalPendingInvitations || 0;
	if ((domain?.totalPendingSuggestions || 0) + totalInvitations === 0) return [];
	return [
		infoLabelKey,
		localizationKeys(`organizationProfile.verifiedDomainPage.enrollmentTab.calloutInvitationCountLabel`, { count: totalInvitations }),
		localizationKeys(`organizationProfile.verifiedDomainPage.enrollmentTab.calloutSuggestionCountLabel`, { count: totalInvitations })
	];
};
const buildEnrollmentOptions = (settings) => {
	const _options = [];
	if (settings.domains.enrollmentModes.includes("manual_invitation")) _options.push({
		value: "manual_invitation",
		label: localizationKeys("organizationProfile.verifiedDomainPage.enrollmentTab.manualInvitationOption__label"),
		description: localizationKeys("organizationProfile.verifiedDomainPage.enrollmentTab.manualInvitationOption__description")
	});
	if (settings.domains.enrollmentModes.includes("automatic_invitation")) _options.push({
		value: "automatic_invitation",
		label: localizationKeys("organizationProfile.verifiedDomainPage.enrollmentTab.automaticInvitationOption__label"),
		description: localizationKeys("organizationProfile.verifiedDomainPage.enrollmentTab.automaticInvitationOption__description")
	});
	if (settings.domains.enrollmentModes.includes("automatic_suggestion")) _options.push({
		value: "automatic_suggestion",
		label: localizationKeys("organizationProfile.verifiedDomainPage.enrollmentTab.automaticSuggestionOption__label"),
		description: localizationKeys("organizationProfile.verifiedDomainPage.enrollmentTab.automaticSuggestionOption__description")
	});
	return _options;
};
const useEnrollmentOptions = () => {
	const { organizationSettings } = useEnvironment();
	return buildEnrollmentOptions(organizationSettings);
};
const VerifiedDomainForm = withCardStateProvider((props) => {
	const { domainId: id, mode = "edit", onSuccess, onReset } = props;
	const card = useCardState();
	const { organizationSettings } = useEnvironment();
	const { membership, organization, domains } = useOrganization({ domains: { infinite: true } });
	const allowsEdit = mode === "edit";
	const enrollmentMode = useFormControl("enrollmentMode", "", {
		type: "radio",
		radioOptions: useEnrollmentOptions(),
		isRequired: true
	});
	const deletePending = useFormControl("deleteExistingInvitationsSuggestions", "", {
		label: localizationKeys("formFieldLabel__organizationDomainDeletePending"),
		type: "checkbox"
	});
	const { data: domain, isLoading: domainIsLoading } = useFetch(organization?.getDomain, { domainId: id });
	useEffect(() => {
		if (domain) enrollmentMode.setValue(domain.enrollmentMode);
	}, [domain?.id]);
	const title = localizationKeys("organizationProfile.verifiedDomainPage.title", { domain: domain?.name || "" });
	const subtitle = localizationKeys("organizationProfile.verifiedDomainPage.subtitle", { domain: domain?.name || "" });
	const calloutLabel = useCalloutLabel(domain, { infoLabel: localizationKeys(`organizationProfile.verifiedDomainPage.enrollmentTab.calloutInfoLabel`) });
	const updateEnrollmentMode = async () => {
		if (!domain || !organization || !membership || !domains) return;
		try {
			await domain.updateEnrollmentMode({
				enrollmentMode: enrollmentMode.value,
				deletePending: deletePending.checked
			});
			await domains.revalidate();
			onSuccess();
		} catch (e) {
			handleError(e, [enrollmentMode], card.setError);
		}
	};
	if (!organization || !organizationSettings) return null;
	if (domainIsLoading || !domain) return /* @__PURE__ */ jsx(Flex, {
		direction: "row",
		align: "center",
		justify: "center",
		sx: { height: "100%" },
		children: /* @__PURE__ */ jsx(Spinner, {
			size: "lg",
			colorScheme: "primary",
			elementDescriptor: descriptors.spinner
		})
	});
	if (!(domain.verification && domain.verification.status === "verified")) onReset();
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: title,
		headerSubtitle: allowsEdit ? void 0 : subtitle,
		gap: 4,
		children: /* @__PURE__ */ jsxs(Col, {
			gap: 6,
			children: [
				calloutLabel.length > 0 && /* @__PURE__ */ jsx(CalloutWithAction, {
					icon: SvgInformationCircle,
					children: calloutLabel.map((label, index) => /* @__PURE__ */ jsx(Text, {
						as: "span",
						sx: { display: "block" },
						localizationKey: label
					}, index))
				}),
				/* @__PURE__ */ jsx(Header.Root, { children: /* @__PURE__ */ jsx(Header.Subtitle, {
					localizationKey: localizationKeys("organizationProfile.verifiedDomainPage.enrollmentTab.subtitle"),
					variant: "subtitle"
				}) }),
				/* @__PURE__ */ jsxs(Form.Root, {
					onSubmit: updateEnrollmentMode,
					gap: 6,
					children: [
						/* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: enrollmentMode.id,
							children: /* @__PURE__ */ jsx(Form.RadioGroup, { ...enrollmentMode.props })
						}),
						allowsEdit && enrollmentMode.value === "manual_invitation" && /* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: deletePending.id,
							children: /* @__PURE__ */ jsx(Form.Checkbox, { ...deletePending.props })
						}),
						/* @__PURE__ */ jsx(FormButtons, {
							isDisabled: domainIsLoading || !domain,
							onReset
						})
					]
				})
			]
		})
	});
});

//#endregion
export { VerifiedDomainForm };
//# sourceMappingURL=VerifiedDomainForm.js.map