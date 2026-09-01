import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { VerifyDomainForm } from "./VerifyDomainForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/VerifyDomainScreen.tsx
const VerifyDomainScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(VerifyDomainForm, {
		onSuccess: close,
		onReset: close,
		skipToVerified: false,
		...props
	});
};

//#endregion
export { VerifyDomainScreen };
//# sourceMappingURL=VerifyDomainScreen.js.map