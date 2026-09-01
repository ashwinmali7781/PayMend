import { createContext, useContext, useState } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/contexts/AcceptedUserInvitations.tsx
const AcceptedInvitations = createContext({
	acceptedInvitations: [],
	setAcceptedInvitations: () => {}
});
function AcceptedInvitationsProvider({ children }) {
	const [acceptedInvitations, setAcceptedInvitations] = useState([]);
	return /* @__PURE__ */ jsx(AcceptedInvitations.Provider, {
		value: {
			acceptedInvitations,
			setAcceptedInvitations
		},
		children
	});
}
function useAcceptedInvitations() {
	return useContext(AcceptedInvitations);
}

//#endregion
export { AcceptedInvitationsProvider, useAcceptedInvitations };
//# sourceMappingURL=AcceptedUserInvitations.js.map