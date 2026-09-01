import { Flex, Icon } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/IconCircle.tsx
const IconCircle = (props) => {
	const { icon, boxElementDescriptor, iconElementDescriptor, sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		center: true,
		elementDescriptor: boxElementDescriptor,
		sx: [(t) => ({
			backgroundColor: t.colors.$neutralAlpha50,
			width: t.sizes.$16,
			height: t.sizes.$16,
			borderRadius: t.radii.$circle
		}), sx],
		...rest,
		children: /* @__PURE__ */ jsx(Icon, {
			elementDescriptor: iconElementDescriptor,
			icon,
			size: "lg",
			sx: (theme) => ({ color: theme.colors.$neutralAlpha600 })
		})
	});
};

//#endregion
export { IconCircle };
//# sourceMappingURL=IconCircle.js.map