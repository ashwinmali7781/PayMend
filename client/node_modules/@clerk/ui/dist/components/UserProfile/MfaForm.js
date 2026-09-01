import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { getSecondFactorsAvailableToAdd } from "../../utils/mfa.js";
import { MfaBackupCodeScreen } from "./MfaBackupCodeScreen.js";
import { MfaPhoneCodeScreen } from "./MfaPhoneCodeScreen.js";
import { MfaTOTPScreen } from "./MfaTOTPScreen.js";
import React from "react";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/MfaForm.tsx
const MfaForm = withCardStateProvider((props) => {
	const { onSuccess, onReset, selectedStrategy = void 0 } = props;
	const card = useCardState();
	const { userSettings: { attributes } } = useEnvironment();
	const { user } = useUser();
	if (!user) return null;
	const title = localizationKeys("userProfile.mfaPage.title");
	const secondFactorsAvailableToAdd = React.useMemo(() => getSecondFactorsAvailableToAdd(attributes, user), []);
	React.useEffect(() => {
		if (secondFactorsAvailableToAdd.length === 0) card.setError("There are no second factors available to add");
	}, []);
	if (card.error) return /* @__PURE__ */ jsx(FormContainer, { headerTitle: title });
	if (secondFactorsAvailableToAdd.length === 0 && !selectedStrategy) return null;
	return /* @__PURE__ */ jsx(MfaPageIfSingleOrCurrent, {
		onSuccess,
		onReset,
		method: selectedStrategy || secondFactorsAvailableToAdd[0]
	});
});
const MfaPageIfSingleOrCurrent = (props) => {
	const { method, onSuccess, onReset } = props;
	switch (method) {
		case "phone_code": return /* @__PURE__ */ jsx(MfaPhoneCodeScreen, {
			onSuccess,
			onReset
		});
		case "totp": return /* @__PURE__ */ jsx(MfaTOTPScreen, {
			onSuccess,
			onReset
		});
		case "backup_code": return /* @__PURE__ */ jsx(MfaBackupCodeScreen, {
			onSuccess,
			onReset
		});
		default: return null;
	}
};

//#endregion
export { MfaForm };
//# sourceMappingURL=MfaForm.js.map