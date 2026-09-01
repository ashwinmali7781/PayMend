import { createVariants } from "../styledSystem/createVariants.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Icon.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: { flexShrink: 0 },
	variants: {
		size: {
			xs: {
				width: theme.sizes.$2x5,
				height: theme.sizes.$2x5
			},
			sm: {
				width: theme.sizes.$3,
				height: theme.sizes.$3
			},
			md: {
				width: theme.sizes.$4,
				height: theme.sizes.$4
			},
			lg: {
				width: theme.sizes.$5,
				height: theme.sizes.$5
			}
		},
		colorScheme: {
			success: { color: theme.colors.$success500 },
			danger: { color: theme.colors.$danger500 },
			warning: { color: theme.colors.$warning500 },
			neutral: { color: theme.colors.$neutralAlpha400 }
		}
	},
	defaultVariants: { size: "md" }
}));
const Icon = (props) => {
	const { icon: Icon, ...rest } = props;
	return /* @__PURE__ */ jsx(Icon, {
		...filterProps(rest),
		css: applyVariants(props)
	});
};

//#endregion
export { Icon };
//# sourceMappingURL=Icon.js.map