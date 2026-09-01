import * as React$1 from "react";

//#region src/icons/magnifying-glass.svg
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
var SvgMagnifyingGlass = function SvgMagnifyingGlass(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M10 10.01a4.25 4.25 0 1 0-6-6.02 4.25 4.25 0 0 0 6 6.02m0 0 3.25 3.24"
	})));
};

//#endregion
export { SvgMagnifyingGlass as default };
//# sourceMappingURL=magnifying-glass.js.map