import SvgAdd from "../icons/add.js";
import { Action } from "../elements/Actions.js";
import { jsx } from "@emotion/react/jsx-runtime";
import { useUser } from "@clerk/shared/react/index";

//#region src/common/CreateOrganizationAction.tsx
const CreateOrganizationAction = (props) => {
	const { icon = SvgAdd, ...rest } = props;
	const { user } = useUser();
	if (!user?.createOrganizationEnabled) return null;
	return /* @__PURE__ */ jsx(Action, {
		...rest,
		icon
	});
};

//#endregion
export { CreateOrganizationAction };
//# sourceMappingURL=CreateOrganizationAction.js.map