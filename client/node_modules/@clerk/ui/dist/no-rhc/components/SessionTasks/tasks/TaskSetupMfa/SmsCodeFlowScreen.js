import { localizationKeys } from "../../../../localization/localizationKeys.js";
import SvgPlus from "../../../../icons/plus.js";
import { useFormControl } from "../../../../utils/useFormControl.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../../../elements/contexts/index.js";
import { Flow } from "../../../../customizables/Flow.js";
import { Button, Col, Flex, Text } from "../../../../customizables/index.js";
import { Card } from "../../../../elements/Card/index.js";
import { Header } from "../../../../elements/Header.js";
import { handleError } from "../../../../utils/errorHandler.js";
import { getFlagEmojiFromCountryIso, parsePhoneString, stringToFormattedPhoneString } from "../../../../utils/phoneUtils.js";
import { Form } from "../../../../elements/Form.js";
import { FormButtonContainer } from "../../../../elements/FormButtons.js";
import { Wizard, useWizard } from "../../../../common/Wizard.js";
import { SuccessPage } from "../../../../elements/SuccessPage.js";
import { Action, Actions } from "../../../../elements/Actions.js";
import { PreviewButton } from "../../../../elements/PreviewButton.js";
import { SharedFooterActionForSignOut } from "./shared.js";
import { MfaBackupCodeList } from "../../../UserProfile/MfaBackupCodeList.js";
import { VerificationCodeContent } from "../../../../elements/VerificationCodeCard.js";
import React, { useMemo, useRef } from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskSetupMfa/SmsCodeFlowScreen.tsx
const getAvailablePhonesFromUser = (user) => {
	return user?.phoneNumbers.filter((phoneNumber) => {
		const hasOtherIdentifications = user?.primaryEmailAddress !== null || user?.primaryWeb3Wallet !== null || user?.passkeys.length > 0 || user?.externalAccounts.length > 0 || user?.enterpriseAccounts.length > 0 || user?.username !== null;
		if (phoneNumber.id === user?.primaryPhoneNumber?.id && !hasOtherIdentifications) return false;
		return !phoneNumber.reservedForSecondFactor;
	}) || [];
};
const MFAVerifyPhoneForSessionTasks = withCardStateProvider((props) => {
	const { onSuccess, resourceRef, onReset } = props;
	const card = useCardState();
	const phone = resourceRef.current;
	const setReservedForSecondFactor = useReverification(() => phone?.setReservedForSecondFactor({ reserved: true }));
	const prepare = () => {
		return resourceRef.current?.prepareVerification?.()?.catch((err) => handleError(err, [], card.setError));
	};
	const enableMfa = async () => {
		card.setLoading(phone?.id);
		try {
			resourceRef.current = await setReservedForSecondFactor();
			onSuccess();
		} catch (err) {
			handleError(err, [], card.setError);
		} finally {
			card.setIdle();
		}
	};
	React.useEffect(() => {
		prepare();
	}, []);
	const action = (code, resolve, reject) => {
		resourceRef.current?.attemptVerification({ code }).then(async () => {
			await resolve();
			await enableMfa();
		}).catch(reject);
	};
	return /* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsx(VerificationCodeContent, {
		cardTitle: localizationKeys("taskSetupMfa.smsCode.verifyPhone.title"),
		cardSubtitle: localizationKeys("taskSetupMfa.smsCode.verifyPhone.subtitle"),
		safeIdentifier: resourceRef.current?.phoneNumber || "",
		inputLabel: localizationKeys("taskSetupMfa.smsCode.verifyPhone.formTitle"),
		resendButton: localizationKeys("taskSetupMfa.smsCode.verifyPhone.resendButton"),
		identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__phoneNumber"),
		badgeText: localizationKeys("taskSetupMfa.badge"),
		onCodeEntryFinishedAction: action,
		onResendCodeClicked: () => void prepare(),
		onIdentityPreviewEditClicked: () => onReset(),
		onBackLinkClicked: () => onReset(),
		backLinkLabel: localizationKeys("taskSetupMfa.smsCode.cancel")
	}) });
});
const AddPhoneForSessionTasks = withCardStateProvider((props) => {
	const { resourceRef, onSuccess, onReset } = props;
	const card = useCardState();
	const { user } = useUser();
	const createPhoneNumber = useReverification((user, opt) => user.createPhoneNumber(opt));
	const phoneField = useFormControl("phoneNumber", "", {
		type: "tel",
		label: localizationKeys("formFieldLabel__phoneNumber"),
		isRequired: true
	});
	const canSubmit = phoneField.value.length > 1 && user?.username !== phoneField.value;
	const addPhone = async (e) => {
		e.preventDefault();
		if (!user) return;
		await card.runAsync(async () => {
			try {
				resourceRef.current = await createPhoneNumber(user, { phoneNumber: phoneField.value });
				onSuccess();
			} catch (e) {
				handleError(e, [phoneField], card.setError);
			}
		});
	};
	return /* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			badgeText: localizationKeys("taskSetupMfa.badge"),
			children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("taskSetupMfa.smsCode.addPhoneNumber") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("taskSetupMfa.smsCode.addPhone.infoText") })]
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsxs(Form.Root, {
			onSubmit: addPhone,
			children: [/* @__PURE__ */ jsx(Form.ControlRow, {
				elementId: phoneField.id,
				children: /* @__PURE__ */ jsx(Form.PhoneInput, {
					...phoneField.props,
					autoFocus: true
				})
			}), /* @__PURE__ */ jsxs(FormButtonContainer, {
				sx: (theme) => ({
					flexDirection: "column",
					gap: theme.space.$4
				}),
				children: [/* @__PURE__ */ jsx(Form.SubmitButton, {
					hasArrow: true,
					isDisabled: !canSubmit,
					localizationKey: localizationKeys("taskSetupMfa.smsCode.addPhone.formButtonPrimary")
				}), /* @__PURE__ */ jsx(Form.ResetButton, {
					localizationKey: localizationKeys("taskSetupMfa.smsCode.cancel"),
					onClick: onReset
				})]
			})]
		})
	] });
});
const SuccessScreen = withCardStateProvider((props) => {
	const { resourceRef, onFinish } = props;
	return /* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsx(SuccessPage, {
		title: localizationKeys("taskSetupMfa.smsCode.success.title"),
		subtitle: localizationKeys("taskSetupMfa.smsCode.success.message1"),
		headerBadgeText: localizationKeys("taskSetupMfa.badge"),
		onFinish,
		contents: /* @__PURE__ */ jsx(MfaBackupCodeList, {
			backupCodes: resourceRef.current?.backupCodes,
			subtitle: localizationKeys("taskSetupMfa.smsCode.success.message2")
		}),
		finishLabel: localizationKeys("taskSetupMfa.smsCode.success.finishButton"),
		finishButtonProps: {
			block: true,
			hasArrow: true
		}
	}) });
});
const PhoneItem = ({ phone, onSuccess, onUnverifiedPhoneClick, resourceRef }) => {
	const card = useCardState();
	const setReservedForSecondFactor = useReverification(() => phone.setReservedForSecondFactor({ reserved: true }));
	const { iso } = parsePhoneString(phone.phoneNumber);
	const flag = getFlagEmojiFromCountryIso(iso);
	const formattedPhone = stringToFormattedPhoneString(phone.phoneNumber);
	const handleSelect = async () => {
		if (phone.verification.status !== "verified") return onUnverifiedPhoneClick(phone);
		card.setLoading(phone.id);
		try {
			resourceRef.current = await setReservedForSecondFactor();
			onSuccess();
		} catch (err) {
			handleError(err, [], card.setError);
		} finally {
			card.setIdle();
		}
	};
	return /* @__PURE__ */ jsx(PreviewButton, {
		isLoading: card.loadingMetadata === phone.id,
		hoverAsFocus: true,
		block: true,
		elementDescriptor: descriptors.taskSetupMfaPhoneSelectionItem,
		sx: (t) => ({ padding: `${t.space.$4} ${t.space.$6}` }),
		onClick: () => void handleSelect(),
		children: /* @__PURE__ */ jsxs(Flex, {
			sx: (t) => ({
				gap: t.space.$4,
				alignItems: "center"
			}),
			children: [/* @__PURE__ */ jsx(Text, {
				sx: (t) => ({ fontSize: t.fontSizes.$lg }),
				children: flag
			}), /* @__PURE__ */ jsx(Text, {
				variant: "buttonLarge",
				children: formattedPhone
			})]
		})
	});
};
const SmsCodeScreen = withCardStateProvider((props) => {
	const { onSuccess, onReset, onAddPhoneClick, onUnverifiedPhoneClick, resourceRef } = props;
	const { user } = useUser();
	const card = useCardState();
	if (!user) return null;
	const availablePhones = getAvailablePhonesFromUser(user);
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "phoneCode",
		children: /* @__PURE__ */ jsxs(Card.Content, {
			sx: (t) => ({ padding: t.space.$none }),
			children: [
				/* @__PURE__ */ jsxs(Header.Root, {
					showLogo: true,
					badgeText: localizationKeys("taskSetupMfa.badge"),
					sx: (t) => ({
						paddingTop: t.space.$8,
						paddingInline: t.space.$8
					}),
					children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("taskSetupMfa.smsCode.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("taskSetupMfa.smsCode.subtitle") })]
				}),
				card.error && /* @__PURE__ */ jsx(Flex, {
					sx: (t) => ({ paddingInline: t.space.$8 }),
					children: /* @__PURE__ */ jsx(Card.Alert, { children: card.error })
				}),
				/* @__PURE__ */ jsxs(Col, { children: [/* @__PURE__ */ jsxs(Actions, {
					elementDescriptor: descriptors.taskSetupMfaPhoneSelectionItems,
					sx: (t) => ({
						borderTopWidth: t.borderWidths.$normal,
						borderTopStyle: t.borderStyles.$solid,
						borderTopColor: t.colors.$borderAlpha100
					}),
					children: [availablePhones?.map((phone) => /* @__PURE__ */ jsx(PhoneItem, {
						phone,
						onSuccess,
						onUnverifiedPhoneClick,
						resourceRef
					}, phone.id)), /* @__PURE__ */ jsx(Action, {
						hoverAsFocus: true,
						label: localizationKeys("taskSetupMfa.smsCode.addPhoneNumber"),
						block: true,
						onClick: onAddPhoneClick,
						icon: SvgPlus,
						elementDescriptor: descriptors.taskSetupMfaPhoneSelectionAddPhoneAction,
						sx: (t) => ({
							borderTopWidth: t.borderWidths.$normal,
							borderTopStyle: t.borderStyles.$solid,
							borderTopColor: t.colors.$borderAlpha100,
							padding: `${t.space.$4} ${t.space.$4}`,
							gap: t.space.$2
						}),
						iconSx: (t) => ({
							width: t.sizes.$8,
							height: t.sizes.$6
						})
					})]
				}), /* @__PURE__ */ jsx(Flex, {
					justify: "center",
					sx: (t) => ({
						borderTopWidth: t.borderWidths.$normal,
						borderTopStyle: t.borderStyles.$solid,
						borderTopColor: t.colors.$borderAlpha100,
						padding: t.space.$4
					}),
					children: /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						onClick: onReset,
						block: true,
						elementDescriptor: descriptors.formButtonReset,
						localizationKey: localizationKeys("taskSetupMfa.smsCode.cancel")
					})
				})] })
			]
		})
	});
});
const STEPS = {
	ADD_PHONE: 0,
	VERIFY_PHONE: 1,
	SELECT_PHONE: 2,
	SUCCESS: 3
};
const SmsCodeFlow = (props) => {
	const { onSuccess, goToStartStep } = props;
	const { user } = useUser();
	const ref = useRef();
	const availablePhones = useMemo(() => {
		if (!user) return [];
		return getAvailablePhonesFromUser(user);
	}, [user]);
	const wizard = useWizard({ defaultStep: availablePhones.length > 0 ? STEPS.SELECT_PHONE : STEPS.ADD_PHONE });
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		animate: false,
		children: [
			/* @__PURE__ */ jsx(AddPhoneForSessionTasks, {
				resourceRef: ref,
				onSuccess: wizard.nextStep,
				onReset: () => availablePhones.length > 0 ? wizard.goToStep(STEPS.SELECT_PHONE) : goToStartStep()
			}),
			/* @__PURE__ */ jsx(MFAVerifyPhoneForSessionTasks, {
				resourceRef: ref,
				onSuccess: () => wizard.goToStep(STEPS.SUCCESS),
				onReset: () => wizard.goToStep(STEPS.ADD_PHONE)
			}),
			/* @__PURE__ */ jsx(SmsCodeScreen, {
				availablePhones,
				onSuccess: wizard.nextStep,
				onReset: goToStartStep,
				onAddPhoneClick: () => wizard.goToStep(STEPS.ADD_PHONE),
				onUnverifiedPhoneClick: (phone) => {
					ref.current = phone;
					wizard.goToStep(STEPS.VERIFY_PHONE);
				},
				resourceRef: ref
			}),
			/* @__PURE__ */ jsx(SuccessScreen, {
				resourceRef: ref,
				onFinish: onSuccess
			})
		]
	}), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsx(SharedFooterActionForSignOut, {}) })] });
};

//#endregion
export { SmsCodeFlow };
//# sourceMappingURL=SmsCodeFlowScreen.js.map