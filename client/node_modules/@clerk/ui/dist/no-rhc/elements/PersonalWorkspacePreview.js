import { UserPreview } from "./UserPreview.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/PersonalWorkspacePreview.tsx
const PersonalWorkspacePreview = (props) => {
	return /* @__PURE__ */ jsx(UserPreview, {
		elementId: "personalWorkspace",
		rounded: false,
		...props
	});
};

//#endregion
export { PersonalWorkspacePreview };
//# sourceMappingURL=PersonalWorkspacePreview.js.map