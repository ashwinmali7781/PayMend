import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/common/PrintableComponent.tsx
const usePrintable = () => {
	const callbacks = [];
	const onPrint = (cb) => callbacks.push(cb);
	const print = () => callbacks.forEach((cb) => cb());
	return {
		print,
		printableProps: { onPrint }
	};
};
const PrintableComponent = (props) => {
	const { children, onPrint } = props;
	const ref = React.useRef(null);
	onPrint(() => {
		printContentsOfElementViaIFrame(ref);
	});
	return /* @__PURE__ */ jsx("div", {
		ref,
		style: {
			position: "fixed",
			left: "-9999px",
			top: 0,
			display: "none"
		},
		children
	});
};
const copyStyles = (iframe, selector = "[data-emotion=cl-internal]") => {
	if (!iframe.contentDocument) return;
	const allStyleText = [...document.head.querySelectorAll(selector)].map((a) => a.innerHTML).join("\n");
	const styleEl = iframe.contentDocument.createElement("style");
	styleEl.innerHTML = allStyleText;
	iframe.contentDocument.head.prepend(styleEl);
};
const setPrintingStyles = (iframe) => {
	if (!iframe.contentDocument) return;
	iframe.contentDocument.body.style.fontFamily = "Arial";
	iframe.contentDocument.body.style.cssText = `* {\n-webkit-print-color-adjust: exact !important;\ncolor-adjust: exact !important;\nprint-color-adjust: exact !important;\n}`;
};
const printContentsOfElementViaIFrame = (elementRef) => {
	const content = elementRef.current;
	if (!content) return;
	const frame = document.createElement("iframe");
	frame.style.position = "fixed";
	frame.style.right = "-2000px";
	frame.style.bottom = "-2000px";
	frame.onload = () => {
		copyStyles(frame);
		setPrintingStyles(frame);
		if (frame.contentDocument && frame.contentWindow) {
			frame.contentDocument.body.innerHTML = content.innerHTML;
			frame.contentWindow.print();
		}
	};
	window.document.body.appendChild(frame);
};

//#endregion
export { PrintableComponent, usePrintable };
//# sourceMappingURL=PrintableComponent.js.map