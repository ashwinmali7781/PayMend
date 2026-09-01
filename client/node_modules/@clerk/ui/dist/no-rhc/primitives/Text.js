import { createVariants } from "../styledSystem/createVariants.js";
import { common } from "../styledSystem/common.js";
import { applyDataStateProps } from "./applyDataStateProps.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Text.tsx
const { applyVariants, filterProps } = createVariants((theme) => {
	return {
		base: {
			boxSizing: "border-box",
			margin: 0,
			fontSize: "inherit",
			textWrap: "pretty",
			...common.disabled(theme)
		},
		variants: {
			variant: common.textVariants(theme),
			colorScheme: {
				body: { color: theme.colors.$colorForeground },
				onPrimaryBg: { color: theme.colors.$colorPrimaryForeground },
				danger: { color: theme.colors.$danger500 },
				success: { color: theme.colors.$success500 },
				warning: { color: theme.colors.$warning500 },
				secondary: { color: theme.colors.$colorMutedForeground },
				inherit: { color: "inherit" }
			},
			truncate: { true: {
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
				overflow: "hidden"
			} }
		},
		defaultVariants: {
			variant: "body",
			colorScheme: "inherit"
		}
	};
});
const Text = React.forwardRef((props, ref) => {
	const { as: As = "p", ...rest } = props;
	return /* @__PURE__ */ jsx(As, {
		...applyDataStateProps(filterProps(rest)),
		"data-variant": props.variant || "body",
		"data-color": props.colorScheme || "inherit",
		css: applyVariants(props),
		ref
	});
});

//#endregion
export { Text };
//# sourceMappingURL=Text.js.map