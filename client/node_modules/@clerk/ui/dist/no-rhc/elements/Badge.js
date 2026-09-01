import { localizationKeys } from "../localization/localizationKeys.js";
import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Span } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/Badge.tsx
const LastAuthenticationStrategyBadge = ({ sx, overlay, ...props }) => {
	return /* @__PURE__ */ jsx(Span, {
		...props,
		elementDescriptor: descriptors.lastAuthenticationStrategyBadge,
		localizationKey: localizationKeys("lastAuthenticationStrategy"),
		sx: [(t) => ({
			...common.textVariants(t).caption,
			background: `linear-gradient(${t.colors.$borderAlpha25}, transparent), ${t.colors.$colorBackground}`,
			border: `${t.space.$px} solid ${t.colors.$borderAlpha150}`,
			borderRadius: t.radii.$lg,
			color: t.colors.$colorMutedForeground,
			height: t.space.$4x5,
			paddingInline: t.space.$1x5,
			whiteSpace: "nowrap",
			boxShadow: `0 0 0 1px ${t.colors.$colorBackground}`,
			...overlay && {
				position: "absolute",
				insetInlineEnd: -1,
				top: -1,
				transform: `translate(${t.space.$2x5}, calc(-50% - ${t.space.$0x5}))`,
				pointerEvents: "none",
				"[dir=\"rtl\"] &": { transform: `translate(-${t.space.$2x5}, calc(-50% - ${t.space.$0x5}))` }
			}
		}), sx]
	});
};

//#endregion
export { LastAuthenticationStrategyBadge };
//# sourceMappingURL=Badge.js.map