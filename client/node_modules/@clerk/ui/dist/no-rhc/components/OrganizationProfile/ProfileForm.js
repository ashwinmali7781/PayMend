import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { OrganizationProfileAvatarUploader } from "./OrganizationProfileAvatarUploader.js";
import { isDefaultImage } from "../../utils/image.js";
import React from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/ProfileForm.tsx
const ProfileForm = withCardStateProvider((props) => {
	const { onSuccess, onReset } = props;
	const title = localizationKeys("organizationProfile.profilePage.title");
	const card = useCardState();
	const { organization } = useOrganization();
	const { organizationSettings } = useEnvironment();
	const nameField = useFormControl("name", organization?.name || "", {
		type: "text",
		label: localizationKeys("formFieldLabel__organizationName"),
		placeholder: localizationKeys("formFieldInputPlaceholder__organizationName")
	});
	const slugField = useFormControl("slug", organization?.slug || "", {
		type: "text",
		label: localizationKeys("formFieldLabel__organizationSlug"),
		placeholder: localizationKeys("formFieldInputPlaceholder__organizationSlug")
	});
	if (!organization) return null;
	const canSubmit = (organization.name !== nameField.value || organization.slug !== slugField.value) && slugField.feedbackType !== "error";
	const organizationSlugEnabled = !organizationSettings.slug.disabled;
	const onSubmit = async (e) => {
		e.preventDefault();
		const updateOrgParams = { name: nameField.value };
		if (organizationSlugEnabled) updateOrgParams.slug = slugField.value;
		return (canSubmit ? organization.update(updateOrgParams) : Promise.resolve()).then(onSuccess).catch((err) => {
			handleError(err, [nameField, slugField], card.setError);
		});
	};
	const uploadAvatar = (file) => {
		return organization.setLogo({ file }).then(() => {
			card.setIdle();
			onSuccess?.();
		}).catch((err) => handleError(err, [], card.setError));
	};
	const onAvatarRemove = () => {
		organization.setLogo({ file: null }).then(() => {
			card.setIdle();
			onSuccess?.();
		}).catch((err) => handleError(err, [], card.setError));
	};
	const onChangeSlug = (event) => {
		updateSlugField(event.target.value);
	};
	const updateSlugField = (val) => {
		slugField.setValue(val);
		slugField.clearFeedback();
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: title,
		children: /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit,
			children: [
				/* @__PURE__ */ jsx(OrganizationProfileAvatarUploader, {
					organization,
					onAvatarChange: uploadAvatar,
					onAvatarRemove: isDefaultImage(organization.imageUrl) ? null : onAvatarRemove
				}),
				/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: nameField.id,
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...nameField.props,
						autoFocus: true,
						isRequired: true,
						ignorePasswordManager: true
					})
				}),
				organizationSlugEnabled && /* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: slugField.id,
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...slugField.props,
						onChange: onChangeSlug,
						ignorePasswordManager: true
					})
				}),
				/* @__PURE__ */ jsx(FormButtons, {
					isDisabled: !canSubmit,
					onReset
				})
			]
		})
	});
});

//#endregion
export { ProfileForm };
//# sourceMappingURL=ProfileForm.js.map