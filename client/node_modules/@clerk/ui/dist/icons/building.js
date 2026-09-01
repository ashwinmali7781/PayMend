import * as React$1 from "react";

//#region src/icons/building.svg
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
var SvgBuilding = function SvgBuilding(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M2.75 13.25h1m0 0v-9.5a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v9.5m-8.5 0h8.5m0 0h1m-6.5 0v-2.5h2.5v2.5m-2.5-7v-.5m2.5.5v-.5"
	})));
};

//#endregion
export { SvgBuilding as default };
//# sourceMappingURL=building.js.map