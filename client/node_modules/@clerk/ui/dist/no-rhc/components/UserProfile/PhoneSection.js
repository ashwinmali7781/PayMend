import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Badge, Box, Flex, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { stringToFormattedPhoneString } from "../../utils/phoneUtils.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { ProfileSection } from "../../elements/Section.js";
import { sortIdentificationBasedOnVerification } from "./utils.js";
import { RemovePhoneForm } from "./RemoveResourceForm.js";
import { PhoneForm } from "./PhoneForm.js";
import { Fragment } from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/PhoneSection.tsx
const RemovePhoneScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(RemovePhoneForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};
const PhoneScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(PhoneForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};
const PhoneSection = ({ shouldAllowCreation = true, shouldAllowDeletion = true }) => {
	const { user } = useUser();
	const hasPhoneNumbers = Boolean(user?.phoneNumbers?.length);
	if (!shouldAllowCreation && !hasPhoneNumbers) return null;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		centered: false,
		title: localizationKeys("userProfile.start.phoneNumbersSection.title"),
		id: "phoneNumbers",
		children: /* @__PURE__ */ jsx(Action.Root, { children: /* @__PURE__ */ jsxs(ProfileSection.ItemList, {
			id: "phoneNumbers",
			children: [sortIdentificationBasedOnVerification(user?.phoneNumbers, user?.primaryPhoneNumberId).map((phone) => {
				const phoneId = phone.id;
				return /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs(ProfileSection.Item, {
						id: "phoneNumbers",
						children: [/* @__PURE__ */ jsx(Box, {
							sx: {
								whiteSpace: "nowrap",
								overflow: "hidden"
							},
							children: /* @__PURE__ */ jsxs(Flex, {
								gap: 2,
								center: true,
								children: [
									/* @__PURE__ */ jsx(Text, {
										sx: (t) => ({ color: t.colors.$colorForeground }),
										children: stringToFormattedPhoneString(phone.phoneNumber)
									}),
									user?.primaryPhoneNumberId === phoneId && /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__primary") }),
									phone.verification.status !== "verified" && /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__unverified") })
								]
							})
						}), /* @__PURE__ */ jsx(PhoneMenu, {
							phone,
							shouldAllowDeletion
						})]
					}),
					/* @__PURE__ */ jsx(Action.Open, {
						value: `remove-${phoneId}`,
						children: /* @__PURE__ */ jsx(Action.Card, {
							variant: "destructive",
							children: /* @__PURE__ */ jsx(RemovePhoneScreen, { phoneId })
						})
					}),
					/* @__PURE__ */ jsx(Action.Open, {
						value: `verify-${phoneId}`,
						children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(PhoneScreen, { phoneId }) })
					})
				] }, phoneId);
			}), shouldAllowCreation && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Action.Trigger, {
				value: "add",
				children: /* @__PURE__ */ jsx(ProfileSection.ArrowButton, {
					id: "phoneNumbers",
					localizationKey: localizationKeys("userProfile.start.phoneNumbersSection.primaryButton")
				})
			}), /* @__PURE__ */ jsx(Action.Open, {
				value: "add",
				children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(PhoneScreen, {}) })
			})] })]
		}) })
	});
};
const PhoneMenu = ({ phone, shouldAllowDeletion = true }) => {
	const card = useCardState();
	const { open } = useActionContext();
	const { user } = useUser();
	const phoneId = phone.id;
	const setPrimary = useReverification((user) => {
		return user.update({ primaryPhoneNumberId: phone.id });
	});
	if (!user) return null;
	const isPrimary = user.primaryPhoneNumberId === phone.id;
	const isVerified = phone.verification.status === "verified";
	const actions = [
		isPrimary && !isVerified ? {
			label: localizationKeys("userProfile.start.phoneNumbersSection.detailsAction__primary"),
			onClick: () => open(`verify-${phoneId}`)
		} : null,
		!isPrimary && isVerified ? {
			label: localizationKeys("userProfile.start.phoneNumbersSection.detailsAction__nonPrimary"),
			onClick: () => setPrimary(user).catch((e) => handleError(e, [], card.setError))
		} : null,
		!isPrimary && !isVerified ? {
			label: localizationKeys("userProfile.start.phoneNumbersSection.detailsAction__unverified"),
			onClick: () => open(`verify-${phoneId}`)
		} : null,
		shouldAllowDeletion ? {
			label: localizationKeys("userProfile.start.phoneNumbersSection.destructiveAction"),
			isDestructive: true,
			onClick: () => open(`remove-${phoneId}`)
		} : null
	].filter((a) => a !== null);
	if (actions.length === 0) return null;
	return /* @__PURE__ */ jsx(ThreeDotsMenu, { actions });
};

//#endregion
export { PhoneSection };
//# sourceMappingURL=PhoneSection.js.map