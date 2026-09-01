import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { createUsernameError } from "../../utils/usernameUtils.js";
import { useReverification, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/UsernameForm.tsx
const UsernameForm = withCardStateProvider((props) => {
	const { onSuccess, onReset } = props;
	const { user } = useUser();
	const updateUsername = useReverification((username) => user?.update({ username }));
	const { userSettings } = useEnvironment();
	const card = useCardState();
	const { t, locale } = useLocalizations();
	const { usernameSettings } = userSettings;
	const usernameField = useFormControl("username", user?.username || "", {
		type: "text",
		label: localizationKeys("formFieldLabel__username"),
		placeholder: localizationKeys("formFieldInputPlaceholder__username"),
		buildErrorMessage: (errors) => createUsernameError(errors, {
			t,
			locale,
			usernameSettings
		})
	});
	if (!user) return null;
	const isUsernameRequired = userSettings.attributes.username?.required;
	const canSubmit = (isUsernameRequired ? usernameField.value.length > 0 : true) && user.username !== usernameField.value;
	const submitUpdate = async () => {
		try {
			await updateUsername(usernameField.value);
			onSuccess();
		} catch (e) {
			handleError(e, [usernameField], card.setError);
		}
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: user.username ? localizationKeys("userProfile.usernamePage.title__update") : localizationKeys("userProfile.usernamePage.title__set"),
		children: /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit: submitUpdate,
			children: [/* @__PURE__ */ jsx(Form.ControlRow, {
				elementId: usernameField.id,
				children: /* @__PURE__ */ jsx(Form.PlainInput, {
					...usernameField.props,
					autoFocus: true,
					isRequired: isUsernameRequired
				})
			}), /* @__PURE__ */ jsx(FormButtons, {
				isDisabled: !canSubmit,
				onReset
			})]
		})
	});
});

//#endregion
export { UsernameForm };
//# sourceMappingURL=UsernameForm.js.map