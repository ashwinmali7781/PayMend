import { localizationKeys } from "../../../../localization/localizationKeys.js";
import { useSignOutContext } from "../../../../contexts/components/SignOut.js";
import { Card } from "../../../../elements/Card/index.js";
import { stringToFormattedPhoneString } from "../../../../utils/phoneUtils.js";
import { useMultipleSessions } from "../../../../hooks/useMultipleSessions.js";
import React from "react";
import { useClerk, useSession, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskSetupMfa/shared.tsx
const commonIdentifier = (user) => {
	const formattedPhoneNumber = user.primaryPhoneNumber?.phoneNumber ? stringToFormattedPhoneString(user.primaryPhoneNumber?.phoneNumber) : null;
	return user.primaryEmailAddress?.emailAddress ?? user.username ?? formattedPhoneNumber;
};
function SharedFooterActionForSignOut() {
	const { user } = useUser();
	const clerk = useClerk();
	const { session } = useSession();
	const { otherSessions } = useMultipleSessions({ user });
	const { navigateAfterSignOut, navigateAfterMultiSessionSingleSignOutUrl } = useSignOutContext();
	const handleSignOut = () => {
		if (otherSessions.length === 0) return clerk.signOut(navigateAfterSignOut);
		return clerk.signOut(navigateAfterMultiSessionSingleSignOutUrl, { sessionId: session?.id });
	};
	const identifier = React.useMemo(() => user ? commonIdentifier(user) : null, [user]);
	return /* @__PURE__ */ jsxs(Card.Action, {
		elementId: "signOut",
		gap: 4,
		justify: "center",
		sx: () => ({ width: "100%" }),
		children: [identifier && /* @__PURE__ */ jsx(Card.ActionText, {
			truncate: true,
			localizationKey: localizationKeys("taskSetupMfa.signOut.actionText", { identifier })
		}), /* @__PURE__ */ jsx(Card.ActionLink, {
			sx: () => ({ flexShrink: 0 }),
			onClick: () => void handleSignOut(),
			localizationKey: localizationKeys("taskSetupMfa.signOut.actionLink")
		})]
	});
}

//#endregion
export { SharedFooterActionForSignOut };
//# sourceMappingURL=shared.js.map