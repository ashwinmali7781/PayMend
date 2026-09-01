import * as React$1 from "react";

//#region src/icons/box.svg
var _path, _path2;
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
var SvgBox = function SvgBox(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M14 10.667V5.333a1.33 1.33 0 0 0-.667-1.153L8.667 1.513a1.33 1.33 0 0 0-1.334 0L2.667 4.18A1.33 1.33 0 0 0 2 5.333v5.334a1.33 1.33 0 0 0 .667 1.153l4.666 2.667a1.33 1.33 0 0 0 1.334 0l4.666-2.667A1.33 1.33 0 0 0 14 10.667"
	})), _path2 || (_path2 = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M2.18 4.633 8 8.007l5.82-3.374M8 14.733V8"
	})));
};

//#endregion
export { SvgBox as default };
//# sourceMappingURL=box.js.map