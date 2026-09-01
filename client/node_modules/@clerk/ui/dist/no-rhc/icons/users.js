import * as React$1 from "react";

//#region src/icons/users.svg
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
var SvgUsers = function SvgUsers(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M10.402 6a1.75 1.75 0 0 0 0-3M9.5 13.25h2.949c.512 0 .893-.45.782-.926l-.208-.89a3.4 3.4 0 0 0-1.27-1.934m-3.503-5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0m-5.48 7.824.208-.89C3.344 9.867 4.808 8.75 6.5 8.75s3.156 1.116 3.523 2.685l.208.89c.11.474-.27.925-.782.925H3.551c-.512 0-.893-.45-.782-.926"
	})));
};

//#endregion
export { SvgUsers as default };
//# sourceMappingURL=users.js.map