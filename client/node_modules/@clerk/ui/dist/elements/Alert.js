import SvgClose from "../icons/close.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Alert as Alert$1, AlertIcon, Button, Col, Icon, Text } from "../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Alert.tsx
const Alert = (props) => {
	const { children, title, subtitle, variant = "warning", onDismiss, dismissLabel, ...rest } = props;
	const { t } = useLocalizations();
	if (!children && !title && !subtitle) return null;
	const textColorScheme = variant === "danger" ? "danger" : variant === "warning" ? "warning" : "secondary";
	const dismissIconColorScheme = variant === "info" ? "neutral" : variant;
	return /* @__PURE__ */ jsxs(Alert$1, {
		elementDescriptor: descriptors.alert,
		elementId: descriptors.alert.setId(variant),
		colorScheme: variant,
		align: "start",
		gap: 2,
		...rest,
		sx: [rest.sx],
		children: [
			/* @__PURE__ */ jsx(AlertIcon, {
				elementId: descriptors.alert.setId(variant),
				elementDescriptor: descriptors.alertIcon,
				variant,
				colorScheme: variant,
				sx: { flexShrink: "0" }
			}),
			/* @__PURE__ */ jsxs(Col, {
				elementDescriptor: descriptors.alertTextContainer,
				elementId: descriptors.alertTextContainer.setId(variant),
				gap: 1,
				sx: { textAlign: "start" },
				children: [/* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.alertText,
					elementId: descriptors.alert.setId(variant),
					colorScheme: textColorScheme,
					variant: subtitle ? "h3" : "body",
					localizationKey: title,
					children
				}), subtitle && /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.alertText,
					elementId: descriptors.alert.setId(variant),
					colorScheme: textColorScheme,
					variant: "body",
					localizationKey: subtitle
				})]
			}),
			onDismiss && /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				colorScheme: variant === "danger" ? "danger" : "neutral",
				"aria-label": typeof dismissLabel === "string" ? dismissLabel : dismissLabel ? t(dismissLabel) : void 0,
				onClick: onDismiss,
				sx: (theme) => ({
					flexShrink: 0,
					padding: theme.space.$1,
					marginInlineStart: "auto",
					marginBlockStart: `calc(-1 * ${theme.space.$1})`
				}),
				children: /* @__PURE__ */ jsx(Icon, {
					icon: SvgClose,
					size: "md",
					colorScheme: dismissIconColorScheme
				})
			})
		]
	});
};

//#endregion
export { Alert };
//# sourceMappingURL=Alert.js.map