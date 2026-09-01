import * as React$1 from "react";

//#region src/icons/fingerprint.svg
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
var SvgFingerprint = function SvgFingerprint(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M4.586 12.227q.176-.391.323-.798M9.67 13.25c.192-.501.318-1.066.458-1.581M5.922 3.226a5.44 5.44 0 0 1 2.501-.47c.863.043 1.7.288 2.433.713a4.9 4.9 0 0 1 1.756 1.716c.419.701.638 1.49.638 2.29q-.002 1.569-.26 3.07l-.536 2.705M2.75 9.852c.2-.763.305-1.558.305-2.377 0-1.027.354-1.979.956-2.754m4.142 2.754a13.8 13.8 0 0 1-1.267 5.775m-1.34-4.614q.058-.574.058-1.16c0-.627.268-1.228.746-1.671a2.66 2.66 0 0 1 1.802-.692c.676 0 1.324.249 1.802.692s.747 1.044.747 1.67q0 .43-.023.857l-.182 1.11"
	})));
};

//#endregion
export { SvgFingerprint as default };
//# sourceMappingURL=fingerprint.js.map