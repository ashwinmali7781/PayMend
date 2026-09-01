import { useAppearance } from "../customizables/AppearanceContext.js";
import React, { forwardRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/withAvatarShimmer.tsx
/**
* This HOC is used to add the hover selector for the avatar shimmer effect to its immediate child.
* It is used since we might want to add the selector to a different element than the avatar itself,
* for example in the <OrganizationSwitcher/>
*/
const withAvatarShimmer = (Component) => {
	return forwardRef((props, ref) => {
		const { parsedOptions } = useAppearance();
		return /* @__PURE__ */ jsx(Component, {
			...props,
			ref,
			sx: [parsedOptions.shimmer ? { ":hover": {
				"--cl-shimmer-hover-transform": "skew(-45deg) translateX(600%)",
				"--cl-shimmer-hover-after-transform": "skewX(45deg) translateX(-150%)"
			} } : {}, props.sx]
		});
	});
};

//#endregion
export { withAvatarShimmer };
//# sourceMappingURL=withAvatarShimmer.js.map