import * as React$1 from "react";

//#region src/icons/exclamation-circle.svg
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
var SvgExclamationCircle = function SvgExclamationCircle(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M8 5.75v1.5m0 3v.01M13.25 8a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0"
	})));
};

//#endregion
export { SvgExclamationCircle as default };
//# sourceMappingURL=exclamation-circle.js.map