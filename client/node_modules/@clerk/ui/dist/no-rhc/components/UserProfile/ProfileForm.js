import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { isDefaultImage } from "../../utils/image.js";
import { InformationBox } from "../../elements/InformationBox.js";
import { UserProfileAvatarUploader } from "./UserProfileAvatarUploader.js";
import React from "react";
import { useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/ProfileForm.tsx
const ProfileForm = withCardStateProvider((props) => {
	const { onSuccess, onReset } = props;
	const card = useCardState();
	const { user } = useUser();
	if (!user) return null;
	const { first_name, last_name } = useEnvironment().userSettings.attributes;
	const showFirstName = first_name?.enabled;
	const showLastName = last_name?.enabled;
	const userFirstName = user.firstName || "";
	const userLastName = user.lastName || "";
	const firstNameField = useFormControl("firstName", user.firstName || "", {
		type: "text",
		label: localizationKeys("formFieldLabel__firstName"),
		placeholder: localizationKeys("formFieldInputPlaceholder__firstName"),
		isRequired: last_name?.required
	});
	const lastNameField = useFormControl("lastName", user.lastName || "", {
		type: "text",
		label: localizationKeys("formFieldLabel__lastName"),
		placeholder: localizationKeys("formFieldInputPlaceholder__lastName"),
		isRequired: last_name?.required
	});
	const userInfoChanged = showFirstName && firstNameField.value !== userFirstName || showLastName && lastNameField.value !== userLastName;
	const optionalFieldsChanged = userInfoChanged;
	const hasRequiredFields = showFirstName && first_name.required || showLastName && last_name.required;
	const requiredFieldsFilled = hasRequiredFields && !!lastNameField.value && !!firstNameField.value && optionalFieldsChanged;
	const nameEditDisabled = user.enterpriseAccounts.some((ea) => ea.active);
	const onSubmit = async (e) => {
		e.preventDefault();
		return (userInfoChanged ? user.update({
			firstName: firstNameField.value,
			lastName: lastNameField.value
		}) : Promise.resolve()).then(onSuccess).catch((err) => {
			handleError(err, [firstNameField, lastNameField], card.setError);
		});
	};
	const uploadAvatar = (file) => {
		return user.setProfileImage({ file }).then(() => {
			card.setIdle();
			onSuccess?.();
		}).catch((err) => handleError(err, [], card.setError));
	};
	const onAvatarRemove = () => {
		user.setProfileImage({ file: null }).then(() => {
			card.setIdle();
			onSuccess?.();
		}).catch((err) => handleError(err, [], card.setError));
	};
	return /* @__PURE__ */ jsxs(FormContainer, {
		headerTitle: localizationKeys("userProfile.profilePage.title"),
		children: [nameEditDisabled && /* @__PURE__ */ jsx(InformationBox, { message: localizationKeys("userProfile.profilePage.readonly") }), /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit,
			sx: (t) => ({ gap: t.space.$6 }),
			children: [
				/* @__PURE__ */ jsx(UserProfileAvatarUploader, {
					user,
					onAvatarChange: uploadAvatar,
					onAvatarRemove: isDefaultImage(user.imageUrl) ? null : onAvatarRemove
				}),
				(showFirstName || showLastName) && /* @__PURE__ */ jsxs(Form.ControlRow, {
					elementId: "name",
					children: [showFirstName && /* @__PURE__ */ jsx(Form.PlainInput, {
						...firstNameField.props,
						isDisabled: nameEditDisabled,
						autoFocus: true
					}), showLastName && /* @__PURE__ */ jsx(Form.PlainInput, {
						...lastNameField.props,
						isDisabled: nameEditDisabled,
						autoFocus: !showFirstName
					})]
				}),
				/* @__PURE__ */ jsx(FormButtons, {
					isDisabled: hasRequiredFields ? !requiredFieldsFilled : !optionalFieldsChanged,
					onReset
				})
			]
		})]
	});
});

//#endregion
export { ProfileForm };
//# sourceMappingURL=ProfileForm.js.map