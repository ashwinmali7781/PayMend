import { handleError } from "./errorHandler.js";
import { ClerkRuntimeError, isClerkAPIResponseError } from "@clerk/shared/error";

//#region src/utils/web3CallbackErrorHandler.ts
const web3CallbackErrorHandler = (err, setError) => {
	if (isClerkAPIResponseError(err) && err.errors?.[0]?.meta?.paramName === "identifier" && err.errors?.[0]?.code === "form_param_nil") return handleError(new ClerkRuntimeError("A Web3 Wallet extension cannot be found. Please install one to continue.", { code: "web3_missing_identifier" }), [], setError);
	return handleError(err, [], setError);
};

//#endregion
export { web3CallbackErrorHandler };
//# sourceMappingURL=web3CallbackErrorHandler.js.map