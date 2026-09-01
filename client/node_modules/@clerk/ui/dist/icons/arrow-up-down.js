import * as React$1 from "react";

//#region src/icons/arrow-up-down.svg
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
var SvgArrowUpDown = function SvgArrowUpDown(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "m14 5-3-3m0 0L8 5m3-3v7m-9 2 3 3m0 0 3-3m-3 3V7"
	})));
};

//#endregion
export { SvgArrowUpDown as default };
//# sourceMappingURL=arrow-up-down.js.map