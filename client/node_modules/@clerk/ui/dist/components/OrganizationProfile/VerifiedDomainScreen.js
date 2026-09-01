import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { VerifiedDomainForm } from "./VerifiedDomainForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/VerifiedDomainScreen.tsx
const VerifiedDomainScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(VerifiedDomainForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};

//#endregion
export { VerifiedDomainScreen };
//# sourceMappingURL=VerifiedDomainScreen.js.map