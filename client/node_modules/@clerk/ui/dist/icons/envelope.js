import * as React$1 from "react";

//#region src/icons/envelope.svg
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
var SvgEnvelope = function SvgEnvelope(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "m3 4.75 5 3.5 5-3.5m-8.25 7.5h6.5a2 2 0 0 0 2-2v-4.5a2 2 0 0 0-2-2h-6.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2"
	})));
};

//#endregion
export { SvgEnvelope as default };
//# sourceMappingURL=envelope.js.map