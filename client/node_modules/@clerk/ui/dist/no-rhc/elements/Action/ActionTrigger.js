import { useActionContext } from "./ActionRoot.js";
import { Children, cloneElement, isValidElement } from "react";

//#region src/elements/Action/ActionTrigger.tsx
const ActionTrigger = (props) => {
	const { children, value, hideOnActive = true } = props;
	const { active, open } = useActionContext();
	const validChildren = Children.only(children);
	if (!isValidElement(validChildren)) throw new Error("Children of ActionTrigger must be a valid element");
	if (hideOnActive && active === value) return null;
	return cloneElement(validChildren, { onClick: async () => {
		await validChildren.props.onClick?.();
		open(value);
	} });
};

//#endregion
export { ActionTrigger };
//# sourceMappingURL=ActionTrigger.js.map