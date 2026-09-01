import { AppearanceContext, useAppearance } from "../customizables/AppearanceContext.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/AppearanceOverrides.tsx
const AppearanceOverrides = ({ elements, children }) => {
	const appearance = useAppearance();
	const augmented = React.useMemo(() => {
		const [base, ...rest] = appearance.parsedElements;
		return {
			...appearance,
			parsedElements: [
				base,
				elements,
				...rest
			]
		};
	}, [appearance, elements]);
	return /* @__PURE__ */ jsx(AppearanceContext.Provider, {
		value: { value: augmented },
		children
	});
};

//#endregion
export { AppearanceOverrides };
//# sourceMappingURL=AppearanceOverrides.js.map