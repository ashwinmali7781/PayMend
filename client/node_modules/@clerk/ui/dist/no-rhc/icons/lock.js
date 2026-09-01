import * as React$1 from "react";

//#region src/icons/lock.svg
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
var SvgLock = function SvgLock(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M5.25 7.75h-1.5v3.5a2 2 0 0 0 2 2h4.5a2 2 0 0 0 2-2v-3.5h-1.5m-5.5 0V5.5a2.75 2.75 0 0 1 5.5 0v2.25m-5.5 0h5.5"
	})));
};

//#endregion
export { SvgLock as default };
//# sourceMappingURL=lock.js.map