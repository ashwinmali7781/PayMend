import { useEnabledThirdPartyProviders } from "../../hooks/useEnabledThirdPartyProviders.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { RemoveResourceForm } from "../../common/RemoveResourceForm.js";
import React from "react";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/RemoveResourceForm.tsx
const RemoveEmailForm = (props) => {
	const { onSuccess, onReset } = props;
	const { user } = useUser();
	const { emailId: id } = props;
	const resource = user?.emailAddresses.find((e) => e.id === id);
	const ref = React.useRef(resource?.emailAddress);
	const unableToSignInText = resource?.verification?.status === "verified" ? localizationKeys("userProfile.emailAddressPage.removeResource.messageLine2") : void 0;
	if (!ref.current) return null;
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("userProfile.emailAddressPage.removeResource.title"),
		messageLine1: localizationKeys("userProfile.emailAddressPage.removeResource.messageLine1", { identifier: ref.current }),
		messageLine2: unableToSignInText,
		successMessage: localizationKeys("userProfile.emailAddressPage.removeResource.successMessage", { emailAddress: ref.current }),
		deleteResource: () => Promise.resolve(resource?.destroy()),
		onSuccess,
		onReset
	});
};
const RemovePhoneForm = (props) => {
	const { phoneId: id, onSuccess, onReset } = props;
	const { user } = useUser();
	const resource = user?.phoneNumbers.find((e) => e.id === id);
	const ref = React.useRef(resource?.phoneNumber);
	const unableToSignInText = resource?.verification?.status === "verified" ? localizationKeys("userProfile.phoneNumberPage.removeResource.messageLine2") : void 0;
	if (!ref.current) return null;
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("userProfile.phoneNumberPage.removeResource.title"),
		messageLine1: localizationKeys("userProfile.phoneNumberPage.removeResource.messageLine1", { identifier: ref.current }),
		messageLine2: unableToSignInText,
		successMessage: localizationKeys("userProfile.phoneNumberPage.removeResource.successMessage", { phoneNumber: ref.current }),
		deleteResource: () => Promise.resolve(resource?.destroy()),
		onSuccess,
		onReset
	});
};
const RemoveConnectedAccountForm = (props) => {
	const { accountId: id, onSuccess, onReset } = props;
	const { user } = useUser();
	const resource = user?.externalAccounts.find((e) => e.id === id);
	const ref = React.useRef(resource?.provider);
	const { providerToDisplayData } = useEnabledThirdPartyProviders();
	if (!ref.current) return null;
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("userProfile.connectedAccountPage.removeResource.title"),
		messageLine1: localizationKeys("userProfile.connectedAccountPage.removeResource.messageLine1", { identifier: providerToDisplayData[ref.current]?.name || "" }),
		messageLine2: localizationKeys("userProfile.connectedAccountPage.removeResource.messageLine2"),
		successMessage: localizationKeys("userProfile.connectedAccountPage.removeResource.successMessage", { connectedAccount: providerToDisplayData[ref.current]?.name || "" }),
		deleteResource: () => Promise.resolve(resource?.destroy()),
		onSuccess,
		onReset
	});
};
const RemoveWeb3WalletForm = (props) => {
	const { user } = useUser();
	const { walletId: id, onSuccess, onReset } = props;
	const resource = user?.web3Wallets.find((e) => e.id === id);
	const ref = React.useRef(resource?.web3Wallet);
	const unableToSignInText = resource?.verification?.status === "verified" ? localizationKeys("userProfile.web3WalletPage.removeResource.messageLine2") : void 0;
	if (!ref.current) return null;
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("userProfile.web3WalletPage.removeResource.title"),
		messageLine1: localizationKeys("userProfile.web3WalletPage.removeResource.messageLine1", { identifier: ref.current }),
		messageLine2: unableToSignInText,
		successMessage: localizationKeys("userProfile.web3WalletPage.removeResource.successMessage", { web3Wallet: ref.current }),
		deleteResource: () => Promise.resolve(resource?.destroy()),
		onSuccess,
		onReset
	});
};
const RemoveMfaPhoneCodeForm = (props) => {
	const { user } = useUser();
	const { phoneId: id, onSuccess, onReset } = props;
	const resource = user?.phoneNumbers.find((e) => e.id === id);
	const ref = React.useRef(resource?.phoneNumber);
	if (!ref.current) return null;
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("userProfile.mfaPhoneCodePage.removeResource.title"),
		messageLine1: localizationKeys("userProfile.mfaPhoneCodePage.removeResource.messageLine1", { identifier: ref.current }),
		messageLine2: localizationKeys("userProfile.mfaPhoneCodePage.removeResource.messageLine2"),
		successMessage: localizationKeys("userProfile.mfaPhoneCodePage.removeResource.successMessage", { mfaPhoneCode: ref.current }),
		deleteResource: () => Promise.resolve(resource?.setReservedForSecondFactor({ reserved: false })),
		onSuccess,
		onReset
	});
};
const RemoveMfaTOTPForm = (props) => {
	const { onSuccess, onReset } = props;
	const { user } = useUser();
	if (!user) return null;
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("userProfile.mfaTOTPPage.removeResource.title"),
		messageLine1: localizationKeys("userProfile.mfaTOTPPage.removeResource.messageLine1"),
		messageLine2: localizationKeys("userProfile.mfaTOTPPage.removeResource.messageLine2"),
		successMessage: localizationKeys("userProfile.mfaTOTPPage.removeResource.successMessage"),
		deleteResource: user.disableTOTP,
		onSuccess,
		onReset
	});
};
const RemovePasskeyForm = (props) => {
	const { onSuccess, onReset, passkey } = props;
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("userProfile.passkeyScreen.removeResource.title"),
		messageLine1: localizationKeys("userProfile.passkeyScreen.removeResource.messageLine1", { name: passkey.name || "" }),
		deleteResource: passkey.delete,
		onSuccess,
		onReset
	});
};

//#endregion
export { RemoveConnectedAccountForm, RemoveEmailForm, RemoveMfaPhoneCodeForm, RemoveMfaTOTPForm, RemovePasskeyForm, RemovePhoneForm, RemoveWeb3WalletForm };
//# sourceMappingURL=RemoveResourceForm.js.map