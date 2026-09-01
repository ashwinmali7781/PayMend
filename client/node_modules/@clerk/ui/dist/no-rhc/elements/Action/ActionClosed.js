import { useActionContext } from "./ActionRoot.js";
import "react";

//#region src/elements/Action/ActionClosed.tsx
const ActionClosed = (props) => {
	const { children, value } = props;
	const values = Array.isArray(value) ? value : [value];
	const { active } = useActionContext();
	if (active && values.includes(active)) return null;
	return children;
};

//#endregion
export { ActionClosed };
//# sourceMappingURL=ActionClosed.js.map