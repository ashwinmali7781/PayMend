import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { RemoveMfaPhoneCodeForm, RemoveMfaTOTPForm } from "./RemoveResourceForm.js";
import { MfaBackupCodeCreateForm } from "./MfaBackupCodeCreateForm.js";
import { MfaForm } from "./MfaForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/MfaScreens.tsx
const RemoveMfaTOTPScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(RemoveMfaTOTPForm, {
		onSuccess: close,
		onReset: close
	});
};
const RemoveMfaPhoneCodeScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(RemoveMfaPhoneCodeForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};
const MfaBackupCodeCreateScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(MfaBackupCodeCreateForm, {
		onSuccess: close,
		onReset: close
	});
};
const MfaScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(MfaForm, {
		onSuccess: close,
		onReset: close,
		selectedStrategy: props.selectedStrategy
	});
};

//#endregion
export { MfaBackupCodeCreateScreen, MfaScreen, RemoveMfaPhoneCodeScreen, RemoveMfaTOTPScreen };
//# sourceMappingURL=MfaScreens.js.map