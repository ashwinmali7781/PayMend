import { Animated } from "../Animated.js";
import { useCallback, useState } from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/Action/ActionRoot.tsx
const [ActionContext, useActionContext, _] = createContextAndHook("ActionContext");
const ActionRoot = (props) => {
	const { animate = true, children, value: controlledValue, onChange } = props;
	const [internalValue, setInternalValue] = useState(null);
	const active = controlledValue !== void 0 ? controlledValue : internalValue;
	const close = useCallback(() => {
		if (onChange) onChange(null);
		else setInternalValue(null);
	}, [onChange]);
	const open = useCallback((newValue) => {
		if (onChange) onChange(newValue);
		else setInternalValue(newValue);
	}, [onChange]);
	const body = /* @__PURE__ */ jsx(ActionContext.Provider, {
		value: { value: {
			active,
			open,
			close
		} },
		children
	});
	if (animate) return /* @__PURE__ */ jsx(Animated, { children: body });
	return body;
};

//#endregion
export { ActionRoot, useActionContext };
//# sourceMappingURL=ActionRoot.js.map