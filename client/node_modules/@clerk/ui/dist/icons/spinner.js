import * as React$1 from "react";

//#region src/icons/spinner.svg
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
var SvgSpinner = function SvgSpinner(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		fill: "currentColor",
		d: "M8 3.5A.75.75 0 1 0 8 2a.75.75 0 0 0 0 1.5M13.25 8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M2.75 8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M4.3 5.04a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M11.7 5.04a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M4.3 12.47a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M11.7 12.47a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M8 14a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
	})), _path2 || (_path2 = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeWidth: 1.5,
		d: "M12.107 11.378A5.25 5.25 0 0 0 11.27 4"
	})));
};

//#endregion
export { SvgSpinner as default };
//# sourceMappingURL=spinner.js.map