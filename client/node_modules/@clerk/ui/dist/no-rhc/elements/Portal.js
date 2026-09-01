import React from "react";
import { createPortal } from "react-dom";

//#region src/elements/Portal.tsx
const Portal = (props) => {
	const elRef = React.useRef(document.createElement("div"));
	React.useEffect(() => {
		document.body.appendChild(elRef.current);
		return () => {
			document.body.removeChild(elRef.current);
		};
	}, []);
	return createPortal(props.children, elRef.current);
};

//#endregion
export { Portal };
//# sourceMappingURL=Portal.js.map