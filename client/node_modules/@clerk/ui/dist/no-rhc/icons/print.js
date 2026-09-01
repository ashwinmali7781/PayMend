import * as React$1 from "react";

//#region src/icons/print.svg
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
var SvgPrint = function SvgPrint(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M4.198 6.914V2.75h7.604v4.164m-6.88 4.164h6.156M2.75 7.095h10.5v4.707c0 .8-.648 1.448-1.448 1.448H4.198c-.8 0-1.448-.648-1.448-1.448z"
	})));
};

//#endregion
export { SvgPrint as default };
//# sourceMappingURL=print.js.map