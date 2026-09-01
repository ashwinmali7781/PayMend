import * as React$1 from "react";

//#region src/icons/link.svg
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
var SvgLink = function SvgLink(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "m7.75 3.79.115-.116a3.154 3.154 0 1 1 4.461 4.46l-.115.116m-5.461 1 2.5-2.5m-1 5.46-.115.116a3.154 3.154 0 1 1-4.461-4.46l.115-.116"
	})));
};

//#endregion
export { SvgLink as default };
//# sourceMappingURL=link.js.map