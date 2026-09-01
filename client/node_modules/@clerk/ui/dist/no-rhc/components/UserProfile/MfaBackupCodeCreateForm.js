import { localizationKeys } from "../../localization/localizationKeys.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Button, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { FullHeightLoader } from "../../elements/FullHeightLoader.js";
import { MfaBackupCodeList } from "./MfaBackupCodeList.js";
import { isReverificationCancelledError } from "@clerk/shared/error";
import React from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/MfaBackupCodeCreateForm.tsx
const MfaBackupCodeCreateForm = withCardStateProvider((props) => {
	const { onSuccess, onReset } = props;
	const { user } = useUser();
	const card = useCardState();
	const { autoFocus: optionAutoFocus } = useAppearance().parsedOptions;
	const createBackupCode = useReverification(() => user?.createBackupCode());
	const [backupCode, setBackupCode] = React.useState(void 0);
	React.useEffect(() => {
		if (backupCode || !user) return;
		createBackupCode().then((backupCode) => setBackupCode(backupCode)).catch((err) => {
			if (isReverificationCancelledError(err)) return onReset();
			handleError(err, [], card.setError);
		});
	}, []);
	if (card.error) return /* @__PURE__ */ jsx(FormContainer, { headerTitle: localizationKeys("userProfile.backupCodePage.title") });
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: localizationKeys("userProfile.backupCodePage.title"),
		children: !backupCode ? /* @__PURE__ */ jsx(FullHeightLoader, {}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
			/* @__PURE__ */ jsx(Text, { localizationKey: localizationKeys("userProfile.backupCodePage.successMessage") }),
			/* @__PURE__ */ jsx(MfaBackupCodeList, {
				subtitle: localizationKeys("userProfile.backupCodePage.subtitle__codelist"),
				backupCodes: backupCode.codes
			}),
			/* @__PURE__ */ jsx(FormButtonContainer, { children: /* @__PURE__ */ jsx(Button, {
				autoFocus: optionAutoFocus,
				onClick: onSuccess,
				localizationKey: localizationKeys("userProfile.formButtonPrimary__finish"),
				elementDescriptor: descriptors.formButtonPrimary
			}) })
		] })
	});
});

//#endregion
export { MfaBackupCodeCreateForm };
//# sourceMappingURL=MfaBackupCodeCreateForm.js.map