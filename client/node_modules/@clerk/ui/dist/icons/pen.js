import * as React$1 from "react";

//#region src/icons/pen.svg
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
var SvgPen = function SvgPen(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M10.75 13.25h2.5M9.237 3.443l-5.055 4.89a2 2 0 0 0-.562 1.003l-.87 3.914 3.705-.872c.357-.084.683-.264.944-.52l5.228-5.138a2.376 2.376 0 0 0-.066-3.277 2.34 2.34 0 0 0-3.324 0"
	})));
};

//#endregion
export { SvgPen as default };
//# sourceMappingURL=pen.js.map