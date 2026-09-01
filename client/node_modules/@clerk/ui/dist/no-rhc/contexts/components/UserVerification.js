import { createContext, useContext } from "react";

//#region src/contexts/components/UserVerification.ts
const UserVerificationContext = createContext(null);
const useUserVerification = () => {
	const context = useContext(UserVerificationContext);
	if (!context || context.componentName !== "UserVerification") throw new Error("Clerk: useUserVerificationContext called outside of the mounted UserVerification component.");
	const { componentName, ...ctx } = context;
	return {
		...ctx,
		componentName
	};
};

//#endregion
export { UserVerificationContext, useUserVerification };
//# sourceMappingURL=UserVerification.js.map