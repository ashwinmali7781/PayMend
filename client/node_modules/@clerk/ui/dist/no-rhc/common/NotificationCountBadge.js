import { localizationKeys } from "../localization/localizationKeys.js";
import { formatToCompactNumber } from "../utils/intl.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { animations } from "../styledSystem/animations.js";
import { Flex, NotificationBadge } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/common/NotificationCountBadge.tsx
const NotificationCountBadge = (props) => {
	const { notificationCount, containerSx, shouldAnimate = true, ...restProps } = props;
	const prefersReducedMotion = usePrefersReducedMotion();
	const { t } = useLocalizations();
	const formattedNotificationCount = formatToCompactNumber(notificationCount, t(localizationKeys("locale")));
	const enterExitAnimation = (t) => ({ animation: shouldAnimate && !prefersReducedMotion ? `${animations.notificationAnimation} ${t.transitionDuration.$textField} ${t.transitionTiming.$slowBezier} 0s 1 normal forwards` : "none" });
	return /* @__PURE__ */ jsx(Flex, {
		justify: "center",
		align: "center",
		as: "span",
		sx: [(t) => ({ marginInlineStart: t.space.$1x5 }), containerSx],
		children: /* @__PURE__ */ jsx(NotificationBadge, {
			sx: enterExitAnimation,
			...restProps,
			children: formattedNotificationCount
		})
	});
};

//#endregion
export { NotificationCountBadge };
//# sourceMappingURL=NotificationCountBadge.js.map