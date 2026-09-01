import { Avatar } from "./Avatar.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/OrganizationAvatar.tsx
const OrganizationAvatar = (props) => {
	const { name = "", imageUrl, showLoadingSpinner, ...rest } = props;
	return /* @__PURE__ */ jsx(Avatar, {
		title: name,
		initials: (name || " ")[0],
		imageUrl,
		showLoadingSpinner,
		rounded: false,
		...rest
	});
};

//#endregion
export { OrganizationAvatar };
//# sourceMappingURL=OrganizationAvatar.js.map