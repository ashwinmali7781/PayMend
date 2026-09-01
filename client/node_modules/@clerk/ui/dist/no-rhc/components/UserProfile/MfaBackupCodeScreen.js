import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Button, Text } from "../../customizables/index.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { MfaBackupCodeCreateForm } from "./MfaBackupCodeCreateForm.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/MfaBackupCodeScreen.tsx
const MfaBackupCodeScreen = withCardStateProvider((props) => {
	const { onSuccess, onReset } = props;
	const wizard = useWizard();
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsx(AddBackupCode, { onContinue: wizard.nextStep }), /* @__PURE__ */ jsx(MfaBackupCodeCreateForm, {
			onSuccess,
			onReset
		})]
	});
});
const AddBackupCode = (props) => {
	const { onContinue } = props;
	const { close } = useActionContext();
	return /* @__PURE__ */ jsxs(FormContainer, {
		headerTitle: localizationKeys("userProfile.backupCodePage.title"),
		children: [
			/* @__PURE__ */ jsx(Text, { localizationKey: localizationKeys("userProfile.backupCodePage.infoText1") }),
			/* @__PURE__ */ jsx(Text, { localizationKey: localizationKeys("userProfile.backupCodePage.infoText2") }),
			/* @__PURE__ */ jsxs(FormButtonContainer, {
				sx: { marginTop: 0 },
				children: [/* @__PURE__ */ jsx(Button, {
					textVariant: "buttonSmall",
					onClick: onContinue,
					localizationKey: localizationKeys("userProfile.formButtonPrimary__finish"),
					elementDescriptor: descriptors.formButtonPrimary
				}), /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					onClick: close,
					localizationKey: localizationKeys("userProfile.formButtonReset"),
					elementDescriptor: descriptors.formButtonReset
				})]
			})
		]
	});
};

//#endregion
export { MfaBackupCodeScreen };
//# sourceMappingURL=MfaBackupCodeScreen.js.map