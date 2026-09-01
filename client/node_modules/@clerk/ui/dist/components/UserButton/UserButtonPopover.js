import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useUserButtonContext } from "../../contexts/components/UserButton.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { UserPreview } from "../../elements/UserPreview.js";
import { PopoverCard } from "../../elements/PopoverCard.js";
import { RootBox } from "../../elements/RootBox.js";
import { MultiSessionActions, SignOutAllActions, SingleSessionActions } from "./SessionActions.js";
import { useMultisessionActions } from "./useMultisessionActions.js";
import React from "react";
import { useSession, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserButton/UserButtonPopover.tsx
const UserButtonPopover = React.forwardRef((props, ref) => {
	const { close: unsafeClose, ...rest } = props;
	const close = () => unsafeClose?.(false);
	const { session } = useSession();
	const userButtonContext = useUserButtonContext();
	const { __experimental_asStandalone } = userButtonContext;
	const { authConfig } = useEnvironment();
	const { user } = useUser();
	const { t } = useLocalizations();
	const { handleAddAccountClicked, handleManageAccountClicked, handleSessionClicked, handleSignOutAllClicked, handleSignOutSessionClicked, handleUserProfileActionClicked, otherSessions } = useMultisessionActions({
		...userButtonContext,
		actionCompleteCallback: close,
		user
	});
	return /* @__PURE__ */ jsx(RootBox, {
		elementDescriptor: descriptors.userButtonPopoverRootBox,
		children: /* @__PURE__ */ jsxs(PopoverCard.Root, {
			elementDescriptor: descriptors.userButtonPopoverCard,
			ref,
			role: "dialog",
			"aria-label": t(localizationKeys("userButton.label__userButtonPopover")),
			shouldEntryAnimate: !__experimental_asStandalone,
			...rest,
			children: [/* @__PURE__ */ jsxs(PopoverCard.Content, {
				elementDescriptor: descriptors.userButtonPopoverMain,
				children: [/* @__PURE__ */ jsx(UserPreview, {
					elementId: "userButton",
					user,
					sx: (t) => ({
						width: "100%",
						padding: `${t.space.$4} ${t.space.$5}`
					})
				}), authConfig.singleSessionMode ? /* @__PURE__ */ jsx(SingleSessionActions, {
					handleManageAccountClicked,
					handleSignOutSessionClicked,
					handleUserProfileActionClicked,
					session,
					completedCallback: close
				}) : /* @__PURE__ */ jsx(MultiSessionActions, {
					session,
					otherSessions,
					handleManageAccountClicked,
					handleSignOutSessionClicked,
					handleSessionClicked,
					handleAddAccountClicked,
					handleUserProfileActionClicked,
					completedCallback: close
				})]
			}), /* @__PURE__ */ jsx(PopoverCard.Footer, {
				elementDescriptor: descriptors.userButtonPopoverFooter,
				children: !authConfig.singleSessionMode && otherSessions.length > 0 && /* @__PURE__ */ jsx(SignOutAllActions, { handleSignOutAllClicked })
			})]
		})
	});
});

//#endregion
export { UserButtonPopover };
//# sourceMappingURL=UserButtonPopover.js.map