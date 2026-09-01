import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { RemoveDomainForm } from "./RemoveDomainForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/RemoveDomainScreen.tsx
const RemoveDomainScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(RemoveDomainForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};

//#endregion
export { RemoveDomainScreen };
//# sourceMappingURL=RemoveDomainScreen.js.map