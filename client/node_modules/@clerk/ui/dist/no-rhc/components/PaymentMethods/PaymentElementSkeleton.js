import { Box, Flex, Grid } from "../../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/PaymentMethods/PaymentElementSkeleton.tsx
const SkeletonLine = (props) => {
	return /* @__PURE__ */ jsx(Box, { sx: [(t) => ({
		height: t.space.$2,
		width: "100%",
		borderRadius: t.radii.$md,
		background: t.colors.$neutralAlpha100
	}), props.sx] });
};
const SkeletonInput = () => {
	return /* @__PURE__ */ jsx(SkeletonLine, { sx: (t) => ({
		height: t.space.$10,
		width: "100%"
	}) });
};
const LineGroup = (props) => {
	return /* @__PURE__ */ jsx(Flex, {
		direction: "col",
		gap: 2,
		children: props.children
	});
};
const PaymentElementSkeleton = () => {
	return /* @__PURE__ */ jsx(Box, {
		"aria-label": "Loading...",
		sx: {
			position: "relative",
			minHeight: 0,
			flex: 1,
			overflowY: "auto"
		},
		children: /* @__PURE__ */ jsxs(Flex, {
			direction: "col",
			gap: 5,
			children: [
				/* @__PURE__ */ jsxs(LineGroup, { children: [/* @__PURE__ */ jsx(SkeletonLine, { sx: (t) => ({
					height: t.space.$3,
					width: t.sizes.$24
				}) }), /* @__PURE__ */ jsx(SkeletonInput, {})] }),
				/* @__PURE__ */ jsxs(Grid, {
					columns: 2,
					gap: 4,
					children: [/* @__PURE__ */ jsxs(LineGroup, { children: [/* @__PURE__ */ jsx(SkeletonLine, { sx: (t) => ({
						height: t.space.$3,
						width: t.sizes.$20
					}) }), /* @__PURE__ */ jsx(SkeletonInput, {})] }), /* @__PURE__ */ jsxs(LineGroup, { children: [/* @__PURE__ */ jsx(SkeletonLine, { sx: (t) => ({
						height: t.space.$3,
						width: t.sizes.$24
					}) }), /* @__PURE__ */ jsx(SkeletonInput, {})] })]
				}),
				/* @__PURE__ */ jsxs(LineGroup, { children: [/* @__PURE__ */ jsx(SkeletonLine, { sx: (t) => ({
					height: t.space.$3,
					width: t.sizes.$16
				}) }), /* @__PURE__ */ jsx(SkeletonInput, {})] }),
				/* @__PURE__ */ jsxs(LineGroup, { children: [
					/* @__PURE__ */ jsx(SkeletonLine, {}),
					/* @__PURE__ */ jsx(SkeletonLine, {}),
					/* @__PURE__ */ jsx(SkeletonLine, { sx: { width: "66.666667%" } })
				] })
			]
		})
	});
};

//#endregion
export { PaymentElementSkeleton };
//# sourceMappingURL=PaymentElementSkeleton.js.map