import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgPlus from "../../icons/plus.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Button, Col, Icon, Text } from "../../customizables/index.js";
import { IconButton } from "../../elements/IconButton.js";
import { handleError } from "../../utils/errorHandler.js";
import { getCountryFromPhoneString, stringToFormattedPhoneString } from "../../utils/phoneUtils.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { VerifyWithCode } from "./VerifyWithCode.js";
import { SuccessPage } from "../../elements/SuccessPage.js";
import { MfaBackupCodeList } from "./MfaBackupCodeList.js";
import { AddPhone } from "./PhoneForm.js";
import React from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/MfaPhoneCodeScreen.tsx
const MfaPhoneCodeScreen = withCardStateProvider((props) => {
	const { onReset, onSuccess } = props;
	const ref = React.useRef();
	const wizard = useWizard({ defaultStep: 2 });
	const isInstanceWithBackupCodes = useEnvironment().userSettings.attributes.backup_code?.enabled;
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [
			/* @__PURE__ */ jsx(AddPhone, {
				title: localizationKeys("userProfile.phoneNumberPage.title"),
				resourceRef: ref,
				onSuccess: wizard.nextStep,
				onUseExistingNumberClick: () => wizard.goToStep(2),
				onReset
			}),
			/* @__PURE__ */ jsx(MFAVerifyPhone, {
				title: localizationKeys("userProfile.mfaPhoneCodePage.title"),
				resourceRef: ref,
				onSuccess: () => isInstanceWithBackupCodes ? wizard.goToStep(3) : onSuccess(),
				onReset: () => wizard.goToStep(2)
			}),
			/* @__PURE__ */ jsx(AddMfa, {
				onSuccess: isInstanceWithBackupCodes ? wizard.nextStep : onSuccess,
				onReset,
				onAddPhoneClick: () => wizard.goToStep(0),
				onUnverifiedPhoneClick: (phone) => {
					ref.current = phone;
					wizard.goToStep(1);
				},
				title: localizationKeys("userProfile.mfaPhoneCodePage.title"),
				resourceRef: ref
			}),
			isInstanceWithBackupCodes && /* @__PURE__ */ jsx(SuccessPage, {
				title: localizationKeys("userProfile.mfaPhoneCodePage.successTitle"),
				text: ref.current?.backupCodes && ref.current?.backupCodes.length > 0 ? [localizationKeys("userProfile.mfaPhoneCodePage.successMessage1"), localizationKeys("userProfile.mfaPhoneCodePage.successMessage2")] : [localizationKeys("userProfile.mfaPhoneCodePage.successMessage1")],
				onFinish: onReset,
				contents: /* @__PURE__ */ jsx(MfaBackupCodeList, { backupCodes: ref.current?.backupCodes })
			})
		]
	});
});
const EnableMFAButtonForPhone = (props) => {
	const { phone, onSuccess, onUnverifiedPhoneClick, resourceRef } = props;
	const card = useCardState();
	const setReservedForSecondFactor = useReverification(() => phone.setReservedForSecondFactor({ reserved: true }));
	const { country } = getCountryFromPhoneString(phone.phoneNumber);
	const formattedPhone = stringToFormattedPhoneString(phone.phoneNumber);
	const enableMfa = async () => {
		if (phone.verification.status !== "verified") return onUnverifiedPhoneClick(phone);
		card.setLoading(phone.id);
		try {
			await setReservedForSecondFactor();
			resourceRef.current = phone;
			onSuccess();
		} catch (err) {
			handleError(err, [], card.setError);
		} finally {
			card.setIdle();
		}
	};
	return /* @__PURE__ */ jsxs(Button, {
		variant: "outline",
		colorScheme: "neutral",
		sx: { justifyContent: "start" },
		onClick: enableMfa,
		isLoading: card.loadingMetadata === phone.id,
		isDisabled: card.isLoading,
		children: [
			country.iso.toUpperCase(),
			" ",
			formattedPhone
		]
	}, phone.id);
};
const MFAVerifyPhone = (props) => {
	const { title, onSuccess, resourceRef, onReset } = props;
	const card = useCardState();
	const phone = resourceRef.current;
	const setReservedForSecondFactor = useReverification(() => phone?.setReservedForSecondFactor({ reserved: true }));
	const enableMfa = async () => {
		card.setLoading(phone?.id);
		try {
			await setReservedForSecondFactor();
			resourceRef.current = phone;
			onSuccess();
		} catch (err) {
			handleError(err, [], card.setError);
		} finally {
			card.setIdle();
		}
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: title,
		headerSubtitle: localizationKeys("userProfile.phoneNumberPage.verifySubtitle", { identifier: resourceRef.current?.phoneNumber || "" }),
		children: /* @__PURE__ */ jsx(VerifyWithCode, {
			nextStep: () => {
				enableMfa();
			},
			identification: resourceRef.current,
			identifier: resourceRef.current?.phoneNumber,
			prepareVerification: resourceRef.current?.prepareVerification,
			onReset
		})
	});
};
const AddMfa = (props) => {
	const { onSuccess, onReset, title, onAddPhoneClick, onUnverifiedPhoneClick, resourceRef } = props;
	const { user } = useUser();
	if (!user) return null;
	const availableMethods = user.phoneNumbers.filter((p) => !p.reservedForSecondFactor);
	return /* @__PURE__ */ jsxs(FormContainer, {
		headerTitle: title,
		gap: 1,
		children: [
			/* @__PURE__ */ jsx(Text, {
				localizationKey: localizationKeys(availableMethods.length ? "userProfile.mfaPhoneCodePage.subtitle__availablePhoneNumbers" : "userProfile.mfaPhoneCodePage.subtitle__unavailablePhoneNumbers"),
				colorScheme: "secondary"
			}),
			availableMethods.length > 0 && /* @__PURE__ */ jsx(Col, {
				gap: 2,
				children: availableMethods.map((phone) => /* @__PURE__ */ jsx(EnableMFAButtonForPhone, {
					onSuccess,
					phone,
					onUnverifiedPhoneClick,
					resourceRef
				}, phone.id))
			}),
			/* @__PURE__ */ jsxs(FormButtonContainer, {
				sx: {
					flexDirection: "row",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ jsx(IconButton, {
					variant: "ghost",
					"aria-label": "Add phone number",
					icon: /* @__PURE__ */ jsx(Icon, {
						icon: SvgPlus,
						sx: (t) => ({ marginInlineEnd: t.space.$2 })
					}),
					localizationKey: localizationKeys("userProfile.mfaPhoneCodePage.primaryButton__addPhoneNumber"),
					onClick: onAddPhoneClick
				}), /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					localizationKey: localizationKeys("userProfile.formButtonReset"),
					onClick: onReset
				})]
			})
		]
	});
};

//#endregion
export { MfaPhoneCodeScreen };
//# sourceMappingURL=MfaPhoneCodeScreen.js.map