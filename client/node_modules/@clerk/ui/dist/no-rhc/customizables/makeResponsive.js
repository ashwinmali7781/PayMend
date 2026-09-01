import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { isDataUri, isValidUrl } from "@clerk/shared/internal/clerk-js/url";

//#region src/customizables/makeResponsive.tsx
const BASE_IMAGE_WIDTH = 80;
const makeResponsive = (Component) => {
	const responsiveComponent = React.forwardRef((props, ref) => {
		const { src, size = BASE_IMAGE_WIDTH, xDescriptors = [1, 2], ...restProps } = props;
		const shouldOptimize = isClerkImage(src);
		return /* @__PURE__ */ jsx(Component, {
			srcSet: shouldOptimize ? generateSrcSet({
				src,
				width: size,
				xDescriptors
			}) : void 0,
			src: shouldOptimize ? generateSrc({
				src,
				width: size * 2
			}) : src,
			...restProps,
			ref
		});
	});
	responsiveComponent.displayName = `Responsive${Component.displayName || Component.name || "Component"}`.replace("_", "");
	return responsiveComponent;
};
const CLERK_IMAGE_URL_BASES = [
	"https://img.clerk.com/",
	"https://img.clerkstage.dev/",
	"https://img.lclclerk.com/"
];
const isClerkImage = (src) => {
	return !!CLERK_IMAGE_URL_BASES.some((base) => src?.includes(base));
};
const generateSrcSet = ({ src, width, xDescriptors }) => {
	if (!src) return "";
	return xDescriptors.map((i) => `${generateSrc({
		src,
		width: width * i
	})} ${i}x`).toString();
};
const generateSrc = ({ src, width }) => {
	if (!isValidUrl(src) || isDataUri(src)) return src;
	if (typeof src !== "string") return src;
	const newSrc = new URL(src);
	if (width) newSrc.searchParams.append("width", width?.toString());
	return newSrc.href;
};

//#endregion
export { makeResponsive };
//# sourceMappingURL=makeResponsive.js.map