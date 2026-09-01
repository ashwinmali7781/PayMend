import { useRouter } from "../../router/RouteContext.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col } from "../../customizables/index.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/ProfileCard/ProfileCardContent.tsx
const ProfileCardContent = (props) => {
	const { contentRef, children, scrollBoxId } = props;
	const router = useRouter();
	const scrollPosRef = React.useRef(0);
	React.useEffect(() => {
		const handleScroll = (e) => {
			const target = e.target;
			if (target.scrollTop) scrollPosRef.current = target.scrollTop;
		};
		contentRef?.current?.addEventListener("scroll", handleScroll);
		return () => contentRef?.current?.removeEventListener("scroll", handleScroll);
	}, []);
	React.useLayoutEffect(() => {
		if (scrollPosRef.current && contentRef?.current) contentRef.current.scrollTop = scrollPosRef.current;
	}, [router.currentPath]);
	return /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.scrollBox,
		sx: (t) => ({
			backgroundColor: t.colors.$colorBackground,
			position: "relative",
			borderRadius: t.radii.$lg,
			width: "100%",
			overflow: "hidden",
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha150,
			marginBlock: "-1px",
			marginInlineEnd: "-1px",
			flex: 1
		}),
		"data-clerk-profile-scroll-box-root": scrollBoxId,
		children: /* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.pageScrollBox,
			sx: (theme) => ({
				flex: `1`,
				scrollbarGutter: "stable",
				...common.maxHeightScroller(theme)
			}),
			ref: contentRef,
			children
		})
	});
};

//#endregion
export { ProfileCardContent };
//# sourceMappingURL=ProfileCardContent.js.map