import { localizationKeys } from "../../../../localization/localizationKeys.js";
import SvgCheckmark from "../../../../icons/checkmark.js";
import SvgClipboard from "../../../../icons/clipboard.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../../../elements/contexts/index.js";
import { Button, Col, Text } from "../../../../customizables/index.js";
import { Card } from "../../../../elements/Card/index.js";
import { QRCode } from "../../../../common/QRCode.js";
import { handleError } from "../../../../utils/errorHandler.js";
import { useFieldOTP } from "../../../../elements/CodeControl.js";
import { Form } from "../../../../elements/Form.js";
import { FormButtonContainer } from "../../../../elements/FormButtons.js";
import { FormContainer } from "../../../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../../../common/Wizard.js";
import { ClipboardInput } from "../../../../elements/ClipboardInput.js";
import { SuccessPage } from "../../../../elements/SuccessPage.js";
import { FullHeightLoader } from "../../../../elements/FullHeightLoader.js";
import { SharedFooterActionForSignOut } from "./shared.js";
import { MfaBackupCodeList } from "../../../UserProfile/MfaBackupCodeList.js";
import { isClerkRuntimeError } from "@clerk/shared/error";
import React, { useRef } from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskSetupMfa/TOTPCodeFlowScreen.tsx
const AddAuthenticatorApp = withCardStateProvider((props) => {
	const { onSuccess, onReset } = props;
	const { user } = useUser();
	const card = useCardState();
	const createTOTP = useReverification(() => user?.createTOTP());
	const [totp, setTOTP] = React.useState(void 0);
	const [displayFormat, setDisplayFormat] = React.useState("qr");
	React.useEffect(() => {
		if (!user) return;
		createTOTP().then((totp) => setTOTP(totp)).catch((err) => {
			if (isClerkRuntimeError(err) && err.code === "reverification_cancelled") return onReset();
			return handleError(err, [], card.setError);
		});
	}, []);
	return /* @__PURE__ */ jsxs(FormContainer, {
		headerTitle: localizationKeys("taskSetupMfa.totpCode.title"),
		headerTitleTextVariant: "h2",
		headerSubtitle: displayFormat === "qr" ? localizationKeys("taskSetupMfa.totpCode.addAuthenticatorApp.infoText__ableToScan") : localizationKeys("taskSetupMfa.totpCode.addAuthenticatorApp.infoText__unableToScan"),
		badgeText: localizationKeys("taskSetupMfa.badge"),
		children: [!totp && /* @__PURE__ */ jsx(FullHeightLoader, {}), totp && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Col, {
			gap: 4,
			children: [displayFormat === "qr" && /* @__PURE__ */ jsx(QRCode, {
				justify: "center",
				url: totp.uri || ""
			}), displayFormat === "uri" && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				localizationKey: localizationKeys("taskSetupMfa.totpCode.addAuthenticatorApp.inputLabel__unableToScan1")
			}), /* @__PURE__ */ jsx(ClipboardInput, {
				value: totp.secret,
				copyIcon: SvgClipboard,
				copiedIcon: SvgCheckmark
			})] })]
		}), /* @__PURE__ */ jsxs(Col, {
			sx: (theme) => ({ gap: theme.space.$8 }),
			children: [
				displayFormat === "qr" && /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					textVariant: "buttonLarge",
					onClick: () => setDisplayFormat("uri"),
					localizationKey: localizationKeys("taskSetupMfa.totpCode.addAuthenticatorApp.buttonUnableToScan__nonPrimary")
				}),
				displayFormat === "uri" && /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					block: true,
					textVariant: "buttonLarge",
					onClick: () => setDisplayFormat("qr"),
					localizationKey: localizationKeys("taskSetupMfa.totpCode.addAuthenticatorApp.buttonAbleToScan__nonPrimary")
				}),
				/* @__PURE__ */ jsxs(FormButtonContainer, {
					sx: (theme) => ({
						flexDirection: "column",
						gap: theme.space.$4
					}),
					children: [/* @__PURE__ */ jsx(Button, {
						block: true,
						onClick: onSuccess,
						hasArrow: true,
						localizationKey: localizationKeys("taskSetupMfa.totpCode.addAuthenticatorApp.formButtonPrimary"),
						elementDescriptor: descriptors.formButtonPrimary
					}), /* @__PURE__ */ jsx(Button, {
						block: true,
						variant: "ghost",
						onClick: onReset,
						localizationKey: localizationKeys("taskSetupMfa.totpCode.addAuthenticatorApp.formButtonReset"),
						elementDescriptor: descriptors.formButtonReset
					})]
				})
			]
		})] })]
	});
});
const VerifyTOTP = withCardStateProvider((props) => {
	const { onSuccess, onReset, resourceRef } = props;
	const { user } = useUser();
	const otp = useFieldOTP({
		onCodeEntryFinished: (code, resolve, reject) => {
			user?.verifyTOTP({ code }).then((totp) => resolve(totp)).catch(reject);
		},
		onResolve: (a) => {
			resourceRef.current = a;
			onSuccess();
		}
	});
	return /* @__PURE__ */ jsxs(FormContainer, {
		headerTitle: localizationKeys("taskSetupMfa.totpCode.verifyTotp.title"),
		headerTitleTextVariant: "h2",
		headerSubtitle: localizationKeys("taskSetupMfa.totpCode.verifyTotp.subtitle"),
		badgeText: localizationKeys("taskSetupMfa.badge"),
		children: [/* @__PURE__ */ jsx(Col, { children: /* @__PURE__ */ jsx(Form.OTPInput, {
			...otp,
			label: localizationKeys("taskSetupMfa.totpCode.verifyTotp.formTitle"),
			description: localizationKeys("taskSetupMfa.totpCode.verifyTotp.subtitle")
		}) }), /* @__PURE__ */ jsxs(FormButtonContainer, {
			sx: (theme) => ({
				flexDirection: "column",
				gap: theme.space.$4
			}),
			children: [/* @__PURE__ */ jsx(Button, {
				onClick: () => otp.onFakeContinue(),
				isDisabled: otp.isLoading,
				hasArrow: true,
				block: true,
				localizationKey: localizationKeys("taskSetupMfa.totpCode.verifyTotp.formButtonPrimary"),
				elementDescriptor: descriptors.formButtonPrimary
			}), /* @__PURE__ */ jsx(Button, {
				onClick: () => onReset?.(),
				variant: "ghost",
				block: true,
				isDisabled: otp.isLoading,
				localizationKey: localizationKeys("taskSetupMfa.totpCode.verifyTotp.formButtonReset"),
				elementDescriptor: descriptors.formButtonReset
			})]
		})]
	});
});
const SuccessScreen = withCardStateProvider((props) => {
	const { resourceRef, onFinish } = props;
	return /* @__PURE__ */ jsx(SuccessPage, {
		title: localizationKeys("taskSetupMfa.totpCode.success.title"),
		subtitle: localizationKeys("taskSetupMfa.totpCode.success.message1"),
		headerBadgeText: localizationKeys("taskSetupMfa.badge"),
		onFinish,
		contents: /* @__PURE__ */ jsx(MfaBackupCodeList, {
			backupCodes: resourceRef.current?.backupCodes,
			subtitle: localizationKeys("taskSetupMfa.totpCode.success.message2")
		}),
		finishLabel: localizationKeys("taskSetupMfa.totpCode.success.finishButton"),
		finishButtonProps: {
			block: true,
			hasArrow: true
		}
	});
});
const TOTPCodeFlow = withCardStateProvider((props) => {
	const { onSuccess, goToStartStep } = props;
	const ref = useRef();
	const wizard = useWizard({ defaultStep: 0 });
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		animate: false,
		children: [
			/* @__PURE__ */ jsx(AddAuthenticatorApp, {
				onSuccess: () => wizard.goToStep(1),
				onReset: goToStartStep
			}),
			/* @__PURE__ */ jsx(VerifyTOTP, {
				onSuccess: () => wizard.goToStep(2),
				onReset: () => wizard.goToStep(0),
				resourceRef: ref
			}),
			/* @__PURE__ */ jsx(SuccessScreen, {
				resourceRef: ref,
				onFinish: onSuccess
			})
		]
	}) }), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsx(SharedFooterActionForSignOut, {}) })] });
});

//#endregion
export { TOTPCodeFlow };
//# sourceMappingURL=TOTPCodeFlowScreen.js.map