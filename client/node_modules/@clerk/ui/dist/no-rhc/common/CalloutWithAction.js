import { Col, Flex, Icon, Link, Text } from "../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/common/CalloutWithAction.tsx
const CalloutWithAction = (props) => {
	const { icon, text, textSx, actionLabel, onClick: onClickProp } = props;
	const onClick = (e) => {
		onClickProp?.(e);
	};
	return /* @__PURE__ */ jsx(Flex, {
		sx: (theme) => ({
			background: theme.colors.$neutralAlpha50,
			padding: `${theme.space.$2x5} ${theme.space.$4}`,
			justifyContent: "space-between",
			alignItems: "flex-start",
			borderRadius: theme.radii.$md
		}),
		children: /* @__PURE__ */ jsxs(Flex, {
			gap: 2,
			children: [/* @__PURE__ */ jsx(Icon, {
				colorScheme: "neutral",
				icon,
				sx: (t) => ({ marginTop: t.space.$1 })
			}), /* @__PURE__ */ jsxs(Col, {
				gap: 4,
				children: [/* @__PURE__ */ jsx(Text, {
					colorScheme: "secondary",
					sx: textSx,
					localizationKey: text,
					children: props.children
				}), actionLabel && /* @__PURE__ */ jsx(Link, {
					colorScheme: "primary",
					variant: "subtitle",
					localizationKey: actionLabel,
					onClick
				})]
			})]
		})
	});
};

//#endregion
export { CalloutWithAction };
//# sourceMappingURL=CalloutWithAction.js.map