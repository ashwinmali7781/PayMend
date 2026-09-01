import { Modal } from "../../elements/Modal.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/APIKeys/APIKeyModal.tsx
/**
* Container styles for modals rendered within a custom portal root (e.g., UserProfile or OrganizationProfile).
* When a modalRoot is provided, the modal is scoped to that container rather than the document root,
* requiring different positioning (absolute instead of fixed) and backdrop styling.
*/
const getScopedPortalContainerStyles = (modalRoot) => {
	return [{ alignItems: "center" }, modalRoot ? (t) => ({
		position: "absolute",
		insetInlineEnd: 0,
		bottom: 0,
		backgroundColor: "inherit",
		backdropFilter: `blur(${t.sizes.$2})`,
		display: "flex",
		justifyContent: "center",
		minHeight: "100%",
		height: "100%",
		width: "100%",
		borderRadius: t.radii.$lg
	}) : {}];
};
const APIKeyModal = ({ modalRoot, containerSx, ...modalProps }) => {
	return /* @__PURE__ */ jsx(Modal, {
		...modalProps,
		portalRoot: modalRoot,
		containerSx: [getScopedPortalContainerStyles(modalRoot), containerSx]
	});
};

//#endregion
export { APIKeyModal };
//# sourceMappingURL=APIKeyModal.js.map