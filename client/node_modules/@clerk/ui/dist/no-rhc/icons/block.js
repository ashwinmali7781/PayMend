import * as React$1 from "react";

//#region src/icons/block.svg
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
var SvgBlock = function SvgBlock(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "m4.38 4.38 7.24 7.24M13.25 8a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0"
	})));
};

//#endregion
export { SvgBlock as default };
//# sourceMappingURL=block.js.map