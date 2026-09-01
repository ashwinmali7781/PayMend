import { useLocalizations } from "../localization/makeLocalizable.js";
import { Button, Icon } from "../customizables/index.js";
import { cloneElement, isValidElement } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/IconButton.tsx
const IconButton = (props) => {
	const { children, icon, localizationKey, iconElementDescriptor, ...rest } = props;
	const { t } = useLocalizations();
	const content = t(localizationKey);
	const _icon = isValidElement(icon) ? cloneElement(icon, {
		"aria-hidden": true,
		focusable: false
	}) : /* @__PURE__ */ jsx(Icon, {
		elementDescriptor: iconElementDescriptor,
		icon,
		size: "md"
	});
	return /* @__PURE__ */ jsx(Button, {
		...rest,
		children: /* @__PURE__ */ jsxs(Fragment$1, { children: [_icon, content || children] })
	});
};

//#endregion
export { IconButton };
//# sourceMappingURL=IconButton.js.map