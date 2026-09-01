import { Avatar } from "./Avatar.js";
import { jsx } from "@emotion/react/jsx-runtime";
import { getFullName, getInitials } from "@clerk/shared/internal/clerk-js/user";

//#region src/elements/UserAvatar.tsx
const UserAvatar = (props) => {
	const { name, firstName, lastName, avatarUrl, imageUrl, ...rest } = props;
	return /* @__PURE__ */ jsx(Avatar, {
		title: getFullName({
			name,
			firstName,
			lastName
		}),
		initials: getInitials({
			name,
			firstName,
			lastName
		}),
		imageUrl: avatarUrl ? avatarUrl : imageUrl,
		...rest
	});
};

//#endregion
export { UserAvatar };
//# sourceMappingURL=UserAvatar.js.map