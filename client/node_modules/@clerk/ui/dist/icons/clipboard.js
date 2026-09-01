import * as React$1 from "react";

//#region src/icons/clipboard.svg
var _path;
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
var SvgClipboard = function SvgClipboard(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M6 3.25H4.75a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H10m-4.25-.5.536 1.34a1.846 1.846 0 0 0 3.428 0l.536-1.34z"
	})));
};

//#endregion
export { SvgClipboard as default };
//# sourceMappingURL=clipboard.js.map