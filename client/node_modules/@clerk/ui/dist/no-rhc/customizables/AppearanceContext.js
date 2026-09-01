import { useWarnAboutCustomizationWithoutPinning } from "../hooks/useWarnAboutCustomizationWithoutPinning.js";
import { parseAppearance } from "./parseAppearance.js";
import React from "react";
import { createContextAndHook, useDeepEqualMemo } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/customizables/AppearanceContext.tsx
const [AppearanceContext, useAppearance] = createContextAndHook("AppearanceContext");
const AppearanceProvider = (props) => {
	const ctxValue = useDeepEqualMemo(() => {
		return { value: parseAppearance(props) };
	}, [
		props.appearance,
		props.globalAppearance,
		props.appearanceKey
	]);
	useWarnAboutCustomizationWithoutPinning(props.appearance);
	return /* @__PURE__ */ jsx(AppearanceContext.Provider, {
		value: ctxValue,
		children: props.children
	});
};

//#endregion
export { AppearanceContext, AppearanceProvider, useAppearance };
//# sourceMappingURL=AppearanceContext.js.map