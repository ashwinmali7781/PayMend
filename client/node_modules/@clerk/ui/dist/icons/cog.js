import * as React$1 from "react";

//#region src/icons/cog.svg
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
var SvgCog = function SvgCog(props) {
	return /*#__PURE__*/ React$1.createElement("svg", _extends({
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 16 16"
	}, props), _path || (_path = /*#__PURE__*/ React$1.createElement("path", {
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeWidth: 1.5,
		d: "M8 7.99V8M3.46 4.843l-.644 1.041c-.135.22-.051.5.144.672.868.768.868 2.12 0 2.888-.195.172-.28.453-.144.672l.644 1.041c.13.21.408.277.65.205 1.16-.346 2.439.316 2.712 1.44.06.242.263.448.522.448h1.312c.259 0 .462-.206.522-.449.273-1.123 1.553-1.785 2.712-1.44.242.073.52.006.65-.204l.644-1.041c.135-.22.05-.5-.144-.672a1.926 1.926 0 0 1 0-2.888c.195-.172.28-.453.144-.672l-.644-1.041c-.13-.21-.408-.277-.65-.205-1.16.346-2.439-.316-2.712-1.44-.06-.242-.263-.448-.522-.448H7.344c-.259 0-.462.206-.522.449C6.55 4.322 5.27 4.984 4.11 4.639c-.242-.073-.52-.006-.65.204"
	})));
};

//#endregion
export { SvgCog as default };
//# sourceMappingURL=cog.js.map