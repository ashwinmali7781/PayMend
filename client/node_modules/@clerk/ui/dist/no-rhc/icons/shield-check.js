import * as React$1 from "react";

//#region src/icons/shield-check.svg
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
var SvgShieldCheck = function SvgShieldCheck(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M13.25 5.9 8 2.75 2.75 5.9S3 12 7.25 13.25m2.5-2.4 1.4 1.4 2.1-3.5"
	})));
};

//#endregion
export { SvgShieldCheck as default };
//# sourceMappingURL=shield-check.js.map