import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { isResetPasswordStrategy } from "./utils.js";

//#region src/components/SignIn/useResetPasswordFactor.tsx
function useResetPasswordFactor() {
	return useCoreSignIn().supportedFirstFactors?.find(({ strategy }) => isResetPasswordStrategy(strategy));
}

//#endregion
export { useResetPasswordFactor };
//# sourceMappingURL=useResetPasswordFactor.js.map