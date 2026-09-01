import { useEnvironment } from "../../../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../../../localization/localizationKeys.js";
import SvgArrowUpTray from "../../../../icons/arrow-up-tray.js";
import { useSessionTasksContext, useTaskChooseOrganizationContext } from "../../../../contexts/components/SessionTasks.js";
import { useFormControl } from "../../../../utils/useFormControl.js";
import { useCardState } from "../../../../elements/contexts/index.js";
import { Icon } from "../../../../customizables/index.js";
import { IconButton } from "../../../../elements/IconButton.js";
import { Header } from "../../../../elements/Header.js";
import { handleError } from "../../../../utils/errorHandler.js";
import { Form } from "../../../../elements/Form.js";
import { FormButtonContainer } from "../../../../elements/FormButtons.js";
import { FormContainer } from "../../../../elements/FormContainer.js";
import { createSlug } from "../../../../utils/createSlug.js";
import { OrganizationProfileAvatarUploader } from "../../../OrganizationProfile/OrganizationProfileAvatarUploader.js";
import { organizationListParams } from "../../../OrganizationSwitcher/utils.js";
import { OrganizationCreationDefaultsAlert } from "./OrganizationCreationDefaultsAlert.js";
import { useState } from "react";
import { useOrganizationList } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskChooseOrganization/CreateOrganizationScreen.tsx
const CreateOrganizationScreen = (props) => {
	const card = useCardState();
	const { navigateOnSetActive } = useSessionTasksContext();
	const { redirectUrlComplete } = useTaskChooseOrganizationContext();
	const { createOrganization, isLoaded, setActive } = useOrganizationList({ userMemberships: organizationListParams.userMemberships });
	const { organizationSettings } = useEnvironment();
	const [file, setFile] = useState();
	const nameField = useFormControl("name", props.organizationCreationDefaults?.form?.name ?? "", {
		type: "text",
		label: localizationKeys("taskChooseOrganization.createOrganization.formFieldLabel__name"),
		placeholder: localizationKeys("taskChooseOrganization.createOrganization.formFieldInputPlaceholder__name")
	});
	const slugField = useFormControl("slug", props.organizationCreationDefaults?.form?.slug ?? "", {
		type: "text",
		label: localizationKeys("taskChooseOrganization.createOrganization.formFieldLabel__slug"),
		placeholder: localizationKeys("taskChooseOrganization.createOrganization.formFieldInputPlaceholder__slug")
	});
	const organizationSlugEnabled = !organizationSettings.slug.disabled;
	const onSubmit = async (e) => {
		e.preventDefault();
		if (!isLoaded) return;
		try {
			const createOrgParams = { name: nameField.value };
			if (organizationSlugEnabled) createOrgParams.slug = slugField.value;
			const organization = await createOrganization(createOrgParams);
			const uploadOrganizationLogoPromise = uploadOrganizationLogo(organization);
			await Promise.allSettled([uploadOrganizationLogoPromise]);
			await setActive({
				organization,
				navigate: async ({ session, decorateUrl }) => {
					await navigateOnSetActive?.({
						session,
						redirectUrlComplete,
						decorateUrl
					});
				}
			});
		} catch (err) {
			handleError(err, [nameField, slugField], card.setError);
		}
	};
	const uploadOrganizationLogo = async (organization) => {
		if (file) await organization.setLogo({ file });
		else if (defaultLogoUrl) {
			const blob = await (await fetch(defaultLogoUrl)).blob();
			const logoFile = new File([blob], "logo", { type: blob.type });
			await organization.setLogo({ file: logoFile });
		}
	};
	const onChangeName = (event) => {
		nameField.setValue(event.target.value);
		updateSlugField(createSlug(event.target.value));
	};
	const updateSlugField = (val) => {
		slugField.setValue(val);
	};
	const onAvatarRemove = () => {
		card.setIdle();
		return setFile(null);
	};
	const isSubmitButtonDisabled = !nameField.value || !isLoaded;
	const defaultLogoUrl = file === void 0 ? props.organizationCreationDefaults?.form?.logo : void 0;
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Header.Root, {
		showLogo: true,
		sx: (t) => ({ padding: `${t.space.$none} ${t.space.$8}` }),
		children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("taskChooseOrganization.createOrganization.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("taskChooseOrganization.createOrganization.subtitle") })]
	}), /* @__PURE__ */ jsx(FormContainer, {
		sx: (t) => ({ padding: `${t.space.$none} ${t.space.$10} ${t.space.$8}` }),
		children: /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit,
			children: [
				/* @__PURE__ */ jsx(OrganizationCreationDefaultsAlert, { organizationCreationDefaults: props.organizationCreationDefaults }),
				/* @__PURE__ */ jsx(OrganizationProfileAvatarUploader, {
					organization: {
						name: nameField.value,
						imageUrl: defaultLogoUrl ?? void 0
					},
					onAvatarChange: async (file) => await setFile(file),
					onAvatarRemove: file || defaultLogoUrl ? onAvatarRemove : null,
					showLoadingSpinner: !!defaultLogoUrl,
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
				}),
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
						onChange: (event) => updateSlugField(event.target.value),
						isRequired: true,
						pattern: "^(?=.*[a-z0-9])[a-z0-9\\-]+$",
						ignorePasswordManager: true
					})
				}),
				/* @__PURE__ */ jsxs(FormButtonContainer, {
					sx: () => ({ flexDirection: "column" }),
					children: [/* @__PURE__ */ jsx(Form.SubmitButton, {
						block: true,
						isDisabled: isSubmitButtonDisabled,
						localizationKey: localizationKeys("taskChooseOrganization.createOrganization.formButtonSubmit")
					}), props.onCancel && /* @__PURE__ */ jsx(Form.ResetButton, {
						localizationKey: localizationKeys("taskChooseOrganization.createOrganization.formButtonReset"),
						onClick: props.onCancel
					})]
				})
			]
		})
	})] });
};

//#endregion
export { CreateOrganizationScreen };
//# sourceMappingURL=CreateOrganizationScreen.js.map