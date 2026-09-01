import React from "react";

//#region src/utils/getValidReactChildren.ts
function getValidChildren(children) {
	return React.Children.toArray(children).filter((child) => React.isValidElement(child));
}

//#endregion
export { getValidChildren };
//# sourceMappingURL=getValidReactChildren.js.map