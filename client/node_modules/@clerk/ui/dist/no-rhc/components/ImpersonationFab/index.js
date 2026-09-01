import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgEye from "../../icons/eye.js";
import { useSignOutContext } from "../../contexts/components/SignOut.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { InternalThemeProvider } from "../../styledSystem/InternalThemeProvider.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col, Flex, Icon, Link, Text } from "../../customizables/index.js";
import { Portal } from "../../elements/Portal.js";
import { useMultipleSessions } from "../../hooks/useMultipleSessions.js";
import React, { useEffect, useRef } from "react";
import { useClerk, useSession, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { getFullName, getIdentifier } from "@clerk/shared/internal/clerk-js/user";

//#region src/components/ImpersonationFab/index.tsx
const EyeCircle = ({ width, height, ...props }) => {
	const { sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.impersonationFabIconContainer,
		center: true,
		sx: [(t) => ({
			width,
			height,
			backgroundColor: t.colors.$danger500,
			borderRadius: t.radii.$circle
		}), sx],
		...rest,
		children: /* @__PURE__ */ jsx(Icon, {
			elementDescriptor: descriptors.impersonationFabIcon,
			icon: SvgEye,
			sx: (t) => ({ color: t.colors.$white }),
			size: "lg"
		})
	});
};
const FabContent = ({ title, signOutText }) => {
	const { session } = useSession();
	const { user } = useUser();
	const { signOut } = useClerk();
	const { otherSessions } = useMultipleSessions({ user });
	const { navigateAfterSignOut, navigateAfterMultiSessionSingleSignOutUrl } = useSignOutContext();
	const handleSignOutSessionClicked = (session) => () => {
		if (otherSessions.length === 0) return signOut(navigateAfterSignOut);
		return signOut(navigateAfterMultiSessionSingleSignOutUrl, { sessionId: session.id });
	};
	return /* @__PURE__ */ jsxs(Col, {
		sx: (t) => ({
			width: "100%",
			paddingInlineStart: t.sizes.$4,
			paddingInlineEnd: t.sizes.$6,
			whiteSpace: "nowrap"
		}),
		children: [/* @__PURE__ */ jsx(Text, {
			colorScheme: "secondary",
			elementDescriptor: descriptors.impersonationFabTitle,
			variant: "buttonLarge",
			truncate: true,
			localizationKey: title
		}), /* @__PURE__ */ jsx(Link, {
			variant: "buttonLarge",
			elementDescriptor: descriptors.impersonationFabActionLink,
			sx: (t) => ({
				alignSelf: "flex-start",
				color: t.colors.$primary500,
				":hover": { cursor: "pointer" }
			}),
			localizationKey: signOutText,
			onClick: handleSignOutSessionClicked(session)
		})]
	});
};
const ImpersonationFabInternal = () => {
	const { session } = useSession();
	const { t } = useLocalizations();
	const { parsedInternalTheme } = useAppearance();
	const containerRef = useRef(null);
	const actor = session?.actor;
	const agent = session?.agent;
	const isImpersonating = !!actor && !agent;
	const eyeWidth = parsedInternalTheme.sizes.$16;
	const eyeHeight = eyeWidth;
	const topProperty = "--cl-impersonation-fab-top";
	const rightProperty = "--cl-impersonation-fab-right";
	const defaultTop = 109;
	const defaultRight = 23;
	const handleResize = () => {
		const current = containerRef.current;
		if (!current) return;
		const offsetRight = window.innerWidth - current.offsetLeft - current.offsetWidth;
		const offsetBottom = window.innerHeight - current.offsetTop - current.offsetHeight;
		if ([
			current.offsetLeft,
			offsetRight,
			current.offsetTop,
			offsetBottom
		].some((o) => o < 0)) {
			document.documentElement.style.setProperty(rightProperty, `${defaultRight}px`);
			document.documentElement.style.setProperty(topProperty, `${defaultTop}px`);
		}
	};
	const onPointerDown = () => {
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", () => {
			window.removeEventListener("pointermove", onPointerMove);
			handleResize();
		}, { once: true });
	};
	const onPointerMove = React.useCallback((e) => {
		e.stopPropagation();
		e.preventDefault();
		const current = containerRef.current;
		if (!current) return;
		const rightOffestBasedOnViewportAndContent = `${window.innerWidth - current.offsetLeft - current.offsetWidth - e.movementX}px`;
		document.documentElement.style.setProperty(rightProperty, rightOffestBasedOnViewportAndContent);
		document.documentElement.style.setProperty(topProperty, `${current.offsetTop - -e.movementY}px`);
	}, []);
	const repositionFabOnResize = () => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	};
	useEffect(repositionFabOnResize, []);
	if (!isImpersonating || !session.user) return null;
	const title = localizationKeys("impersonationFab.title", { identifier: getFullName(session.user) || getIdentifier(session.user) });
	const titleLength = t(title).length;
	return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsxs(Flex, {
		ref: containerRef,
		elementDescriptor: descriptors.impersonationFab,
		onPointerDown,
		align: "center",
		sx: (t) => ({
			touchAction: "none",
			position: "fixed",
			overflow: "hidden",
			top: `var(${topProperty}, ${defaultTop}px)`,
			right: `var(${rightProperty}, ${defaultRight}px)`,
			zIndex: t.zIndices.$fab,
			boxShadow: t.shadows.$fabShadow,
			borderRadius: t.radii.$halfHeight,
			backgroundColor: t.colors.$white,
			fontFamily: t.fonts.$main,
			":hover": { cursor: "grab" },
			":hover #cl-impersonationText": {
				transition: `max-width ${t.transitionDuration.$slowest} ease, opacity ${t.transitionDuration.$slower} ease ${t.transitionDuration.$slowest}`,
				maxWidth: `min(calc(50vw - ${eyeWidth} - 2 * ${defaultRight}px), ${titleLength}ch)`,
				[mqu.md]: { maxWidth: `min(calc(100vw - ${eyeWidth} - 2 * ${defaultRight}px), ${titleLength}ch)` },
				opacity: 1
			},
			":hover #cl-impersonationEye": { transform: "rotate(-180deg)" }
		}),
		children: [/* @__PURE__ */ jsx(EyeCircle, {
			id: "cl-impersonationEye",
			width: eyeWidth,
			height: eyeHeight,
			sx: (t) => ({ transition: `transform ${t.transitionDuration.$slowest} ease` })
		}), /* @__PURE__ */ jsx(Flex, {
			id: "cl-impersonationText",
			sx: (t) => ({
				transition: `max-width ${t.transitionDuration.$slowest} ease, opacity ${t.transitionDuration.$fast} ease`,
				maxWidth: "0px",
				opacity: 0
			}),
			children: /* @__PURE__ */ jsx(FabContent, {
				title,
				signOutText: localizationKeys("impersonationFab.action__signOut")
			})
		})]
	}) });
};
const ImpersonationFab = withCoreUserGuard(() => /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(ImpersonationFabInternal, {}) }));

//#endregion
export { ImpersonationFab };
//# sourceMappingURL=index.js.map