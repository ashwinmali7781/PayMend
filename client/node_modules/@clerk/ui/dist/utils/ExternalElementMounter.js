import { useEffect, useRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/utils/ExternalElementMounter.tsx
const ExternalElementMounter = ({ mount, unmount, ref: _forwardedRef, ...rest }) => {
	const nodeRef = useRef(null);
	useEffect(() => {
		let elRef;
		if (nodeRef.current) {
			elRef = nodeRef.current;
			mount(nodeRef.current);
		}
		return () => {
			unmount(elRef);
		};
	}, [nodeRef.current]);
	return /* @__PURE__ */ jsx("div", {
		ref: nodeRef,
		...rest
	});
};

//#endregion
export { ExternalElementMounter };
//# sourceMappingURL=ExternalElementMounter.js.map