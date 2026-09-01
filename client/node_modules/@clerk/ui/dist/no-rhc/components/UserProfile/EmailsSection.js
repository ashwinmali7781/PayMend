import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Badge, Flex, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { ProfileSection } from "../../elements/Section.js";
import { sortIdentificationBasedOnVerification } from "./utils.js";
import { EmailForm } from "./EmailForm.js";
import { RemoveEmailForm } from "./RemoveResourceForm.js";
import { Fragment } from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/EmailsSection.tsx
const RemoveEmailScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(RemoveEmailForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};
const EmailScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(EmailForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};
const EmailsSection = ({ shouldAllowCreation = true, shouldAllowDeletion = true }) => {
	const { user } = useUser();
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys("userProfile.start.emailAddressesSection.title"),
		centered: false,
		id: "emailAddresses",
		children: /* @__PURE__ */ jsx(Action.Root, { children: /* @__PURE__ */ jsxs(ProfileSection.ItemList, {
			id: "emailAddresses",
			children: [sortIdentificationBasedOnVerification(user?.emailAddresses, user?.primaryEmailAddressId).map((email) => {
				const emailId = email.id;
				return /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs(ProfileSection.Item, {
						id: "emailAddresses",
						children: [/* @__PURE__ */ jsxs(Flex, {
							sx: (t) => ({
								overflow: "hidden",
								gap: t.space.$1,
								alignItems: "center"
							}),
							children: [
								/* @__PURE__ */ jsx(Text, {
									sx: (t) => ({ color: t.colors.$colorForeground }),
									truncate: true,
									children: email.emailAddress
								}),
								user?.primaryEmailAddressId === emailId && /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__primary") }),
								email.verification.status !== "verified" && /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__unverified") })
							]
						}), /* @__PURE__ */ jsx(EmailMenu, {
							email,
							shouldAllowDeletion
						})]
					}),
					/* @__PURE__ */ jsx(Action.Open, {
						value: `remove-${emailId}`,
						children: /* @__PURE__ */ jsx(Action.Card, {
							variant: "destructive",
							children: /* @__PURE__ */ jsx(RemoveEmailScreen, { emailId })
						})
					}),
					/* @__PURE__ */ jsx(Action.Open, {
						value: `verify-${emailId}`,
						children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(EmailScreen, { emailId }) })
					})
				] }, email.emailAddress);
			}), shouldAllowCreation && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Action.Trigger, {
				value: "add",
				children: /* @__PURE__ */ jsx(ProfileSection.ArrowButton, {
					id: "emailAddresses",
					localizationKey: localizationKeys("userProfile.start.emailAddressesSection.primaryButton")
				})
			}), /* @__PURE__ */ jsx(Action.Open, {
				value: "add",
				children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(EmailScreen, {}) })
			})] })]
		}) })
	});
};
const EmailMenu = ({ email, shouldAllowDeletion = true }) => {
	const card = useCardState();
	const { user } = useUser();
	const { open } = useActionContext();
	const emailId = email.id;
	const isPrimary = user?.primaryEmailAddressId === emailId;
	const isVerified = email.verification.status === "verified";
	const setPrimary = useReverification(() => {
		return user?.update({ primaryEmailAddressId: emailId });
	});
	const actions = [
		isPrimary && !isVerified ? {
			label: localizationKeys("userProfile.start.emailAddressesSection.detailsAction__primary"),
			onClick: () => open(`verify-${emailId}`)
		} : null,
		!isPrimary && isVerified ? {
			label: localizationKeys("userProfile.start.emailAddressesSection.detailsAction__nonPrimary"),
			onClick: () => {
				setPrimary().catch((e) => handleError(e, [], card.setError));
			}
		} : null,
		!isPrimary && !isVerified ? {
			label: localizationKeys("userProfile.start.emailAddressesSection.detailsAction__unverified"),
			onClick: () => open(`verify-${emailId}`)
		} : null,
		shouldAllowDeletion ? {
			label: localizationKeys("userProfile.start.emailAddressesSection.destructiveAction"),
			isDestructive: true,
			onClick: () => open(`remove-${emailId}`)
		} : null
	].filter((a) => a !== null);
	if (actions.length === 0) return null;
	return /* @__PURE__ */ jsx(ThreeDotsMenu, { actions });
};

//#endregion
export { EmailsSection };
//# sourceMappingURL=EmailsSection.js.map