import * as React$1 from "react";

//#region src/icons/add.svg
var _circle, _path;
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
var SvgAdd = function SvgAdd(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "currentColor",
		viewBox: "0 0 36 24"
	}, props), _circle || (_circle = /*#__PURE__*/ React$1.createElement("circle", {
		cx: 18,
		cy: 12,
		r: 11.5,
		fillOpacity: .1,
		stroke: "currentColor",
		strokeDasharray: "2 2",
		strokeOpacity: .4
	})), _path || (_path = /*#__PURE__*/ React$1.createElement("path", { d: "M18.75 7.75a.75.75 0 1 0-1.5 0v3.5h-3.5a.75.75 0 1 0 0 1.5h3.5v3.5a.75.75 0 1 0 1.5 0v-3.5h3.5a.75.75 0 1 0 0-1.5h-3.5z" })));
};

//#endregion
export { SvgAdd as default };
//# sourceMappingURL=add.js.map