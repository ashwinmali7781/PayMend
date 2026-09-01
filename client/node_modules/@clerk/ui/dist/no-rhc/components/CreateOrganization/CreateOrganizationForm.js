import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgArrowUpTray from "../../icons/arrow-up-tray.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Col, Icon } from "../../customizables/index.js";
import { IconButton } from "../../elements/IconButton.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { SuccessPage } from "../../elements/SuccessPage.js";
import { createSlug } from "../../utils/createSlug.js";
import { InviteMembersForm } from "../OrganizationProfile/InviteMembersForm.js";
import { InvitationsSentMessage } from "../OrganizationProfile/InviteMembersScreen.js";
import { OrganizationProfileAvatarUploader } from "../OrganizationProfile/OrganizationProfileAvatarUploader.js";
import { organizationListParams } from "../OrganizationSwitcher/utils.js";
import React from "react";
import { useOrganization, useOrganizationList } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/CreateOrganization/CreateOrganizationForm.tsx
const CreateOrganizationForm = withCardStateProvider((props) => {
	const card = useCardState();
	const wizard = useWizard({ onNextStep: () => card.setError(void 0) });
	const lastCreatedOrganizationRef = React.useRef(null);
	const { createOrganization, isLoaded, setActive, userMemberships } = useOrganizationList({ userMemberships: organizationListParams.userMemberships });
	const { organization } = useOrganization();
	const { organizationSettings } = useEnvironment();
	const [file, setFile] = React.useState();
	const nameField = useFormControl("name", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__organizationName"),
		placeholder: localizationKeys("formFieldInputPlaceholder__organizationName")
	});
	const slugField = useFormControl("slug", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__organizationSlug"),
		placeholder: localizationKeys("formFieldInputPlaceholder__organizationSlug")
	});
	const canSubmit = !!nameField.value;
	const organizationSlugEnabled = !organizationSettings.slug.disabled;
	const onSubmit = async (e) => {
		e.preventDefault();
		if (!canSubmit) return;
		if (!isLoaded) return;
		try {
			const createOrgParams = { name: nameField.value };
			if (organizationSlugEnabled) createOrgParams.slug = slugField.value;
			const organization = await createOrganization(createOrgParams);
			if (file) await organization.setLogo({ file });
			lastCreatedOrganizationRef.current = organization;
			await setActive({ organization });
			userMemberships.revalidate?.();
			if (props.skipInvitationScreen ?? organization.maxAllowedMemberships === 1) return completeFlow();
			wizard.nextStep();
		} catch (err) {
			handleError(err, [nameField, slugField], card.setError);
		}
	};
	const completeFlow = () => {
		props.navigateAfterCreateOrganization?.(lastCreatedOrganizationRef.current);
		props.onComplete?.();
	};
	const onAvatarRemove = () => {
		card.setIdle();
		return setFile(null);
	};
	const onChangeName = (event) => {
		nameField.setValue(event.target.value);
		updateSlugField(createSlug(event.target.value));
	};
	const onChangeSlug = (event) => {
		updateSlugField(event.target.value);
	};
	const updateSlugField = (val) => {
		slugField.setValue(val);
	};
	const headerTitleTextVariant = "h2";
	const headerSubtitleTextVariant = props.flow === "organizationList" ? "subtitle" : void 0;
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [
			/* @__PURE__ */ jsx(FormContainer, {
				headerTitle: props?.startPage?.headerTitle,
				headerSubtitle: props?.startPage?.headerSubtitle,
				headerTitleTextVariant,
				headerSubtitleTextVariant,
				sx: (t) => ({
					minHeight: t.sizes.$60,
					gap: t.space.$6,
					textAlign: "start"
				}),
				children: /* @__PURE__ */ jsxs(Form.Root, {
					onSubmit,
					sx: (t) => ({ gap: t.space.$6 }),
					children: [
						/* @__PURE__ */ jsx(Col, { children: /* @__PURE__ */ jsx(OrganizationProfileAvatarUploader, {
							organization: { name: nameField.value },
							onAvatarChange: async (file) => await setFile(file),
							onAvatarRemove: file ? onAvatarRemove : null,
							avatarPreviewPlaceholder: /* @__PURE__ */ jsx(IconButton, {
								variant: "ghost",
								"aria-label": "Upload organization logo",
								icon: /* @__PURE__ */ jsx(Icon, {
									size: "md",
									icon: SvgArrowUpTray,
									sx: (t) => ({
										color: t.colors.$colorMutedForeground,
										transitionDuration: t.transitionDuration.$controls
									})
								}),
								sx: (t) => ({
									width: t.sizes.$16,
									height: t.sizes.$16,
									borderRadius: t.radii.$md,
									borderWidth: t.borderWidths.$normal,
									borderStyle: t.borderStyles.$dashed,
									borderColor: t.colors.$borderAlpha200,
									backgroundColor: t.colors.$neutralAlpha50,
									":hover": {
										backgroundColor: t.colors.$neutralAlpha50,
										svg: { transform: "scale(1.2)" }
									}
								})
							})
						}) }),
						/* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: nameField.id,
							children: /* @__PURE__ */ jsx(Form.PlainInput, {
								...nameField.props,
								onChange: onChangeName,
								isRequired: true,
								autoFocus: true,
								ignorePasswordManager: true
							})
						}),
						organizationSlugEnabled && /* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: slugField.id,
							children: /* @__PURE__ */ jsx(Form.PlainInput, {
								...slugField.props,
								onChange: onChangeSlug,
								isRequired: true,
								pattern: "^(?=.*[a-z0-9])[a-z0-9\\-]+$",
								ignorePasswordManager: true
							})
						}),
						/* @__PURE__ */ jsxs(FormButtonContainer, {
							sx: (t) => ({ marginTop: t.space.$none }),
							children: [/* @__PURE__ */ jsx(Form.SubmitButton, {
								block: false,
								isDisabled: !canSubmit,
								localizationKey: localizationKeys("createOrganization.formButtonSubmit")
							}), props.onCancel && /* @__PURE__ */ jsx(Form.ResetButton, {
								localizationKey: localizationKeys("userProfile.formButtonReset"),
								block: false,
								onClick: props.onCancel
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(FormContainer, {
				headerTitle: localizationKeys("organizationProfile.invitePage.title"),
				headerTitleTextVariant,
				headerSubtitleTextVariant,
				sx: () => ({ textAlign: "start" }),
				children: organization && /* @__PURE__ */ jsx(InviteMembersForm, {
					resetButtonLabel: localizationKeys("createOrganization.invitePage.formButtonReset"),
					onSuccess: wizard.nextStep,
					onReset: completeFlow
				})
			}),
			/* @__PURE__ */ jsxs(Col, { children: [/* @__PURE__ */ jsx(Header.Root, { children: /* @__PURE__ */ jsx(Header.Title, {
				localizationKey: localizationKeys("organizationProfile.invitePage.title"),
				sx: { textAlign: "start" }
			}) }), /* @__PURE__ */ jsx(SuccessPage, {
				contents: /* @__PURE__ */ jsx(InvitationsSentMessage, {}),
				onFinish: completeFlow
			})] })
		]
	});
});

//#endregion
export { CreateOrganizationForm };
//# sourceMappingURL=CreateOrganizationForm.js.map