import { createContext, useContext } from "react";

//#region src/contexts/components/UserAvatar.ts
const UserAvatarContext = createContext(null);
const useUserAvatarContext = () => {
	const context = useContext(UserAvatarContext);
	if (!context || context.componentName !== "UserAvatar") throw new Error("Clerk: useUserAvatarContext called outside UserAvatar.");
	const { componentName, ...ctx } = context;
	return {
		...ctx,
		componentName
	};
};

//#endregion
export { UserAvatarContext, useUserAvatarContext };
//# sourceMappingURL=UserAvatar.js.map