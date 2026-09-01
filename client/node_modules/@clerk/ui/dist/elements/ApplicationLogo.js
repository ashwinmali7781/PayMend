import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { Link } from "../primitives/Link.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Image } from "../customizables/index.js";
import { RouterLink } from "./RouterLink.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/ApplicationLogo.tsx
const getContainerHeightForImageRatio = (imageRef, width) => {
	if (!imageRef.current) return `calc(${width} * 2)`;
	const ratio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
	if (ratio <= 1) return `calc(${width} * 2)`;
	else if (ratio > 1 && ratio <= 2) return `calc((${width} * 2) / ${ratio})`;
	return width;
};
const ApplicationLogo = (props) => {
	const { src, alt, href, isExternal, sx, ...rest } = props;
	const imageRef = React.useRef(null);
	const [loaded, setLoaded] = React.useState(false);
	const { logoImageUrl, applicationName, homeUrl } = useEnvironment().displayConfig;
	const { parsedOptions } = useAppearance();
	const imageSrc = src || parsedOptions.logoImageUrl || logoImageUrl;
	const imageAlt = alt || applicationName;
	const logoUrl = href || parsedOptions.logoLinkUrl || homeUrl;
	if (!imageSrc) return null;
	const image = /* @__PURE__ */ jsx(Image, {
		ref: imageRef,
		elementDescriptor: descriptors.logoImage,
		alt: imageAlt,
		src: imageSrc,
		size: 200,
		onLoad: () => setLoaded(true),
		sx: {
			display: loaded ? "inline-block" : "none",
			height: "100%",
			width: "100%",
			objectFit: "contain"
		}
	});
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.logoBox,
		...rest,
		sx: [(theme) => ({
			height: getContainerHeightForImageRatio(imageRef, theme.sizes.$6),
			justifyContent: "center"
		}), sx],
		children: logoUrl ? isExternal ? /* @__PURE__ */ jsx(Link, {
			focusRing: true,
			href: logoUrl,
			isExternal: true,
			children: image
		}) : /* @__PURE__ */ jsx(RouterLink, {
			focusRing: true,
			to: logoUrl,
			children: image
		}) : image
	});
};

//#endregion
export { ApplicationLogo };
//# sourceMappingURL=ApplicationLogo.js.map