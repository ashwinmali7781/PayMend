import { __internal_useClientBase } from "@clerk/shared/react";

//#region src/contexts/CoreClientContext.tsx
function useCoreSignIn() {
	const client = __internal_useClientBase();
	if (!client) throw new Error("Client must be defined before calling useCoreSignIn. This is a bug in Clerk, please report it to support@clerk.com");
	return client.signIn;
}
function useCoreSignUp() {
	const client = __internal_useClientBase();
	if (!client) throw new Error("Client must be defined before calling useCoreSignUp. This is a bug in Clerk, please report it to support@clerk.com");
	return client.signUp;
}

//#endregion
export { useCoreSignIn, useCoreSignUp };
//# sourceMappingURL=CoreClientContext.js.map