import { useCheckoutContext } from "../../contexts/components/Checkout.js";
import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { transitionDurationValues, transitionTiming } from "../../foundations/transitions.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Button, Heading, Span, Text } from "../../customizables/index.js";
import { Drawer, useDrawerContext } from "../../elements/Drawer.js";
import { LineItems } from "../../elements/LineItems.js";
import { formatDate } from "../../utils/formatDate.js";
import { useEffect, useId, useRef, useState } from "react";
import { __experimental_useCheckout } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Checkout/CheckoutComplete.tsx
const capitalize = (name) => name[0].toUpperCase() + name.slice(1);
const lerp = (start, end, amt) => start + (end - start) * amt;
const SuccessRing = ({ positionX, positionY }) => {
	const animationRef = useRef(null);
	const [currentPosition, setCurrentPosition] = useState({
		x: 256,
		y: 256
	});
	const canHover = typeof window === "undefined" ? true : window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	useEffect(() => {
		if (!canHover) return;
		const animate = () => {
			setCurrentPosition((prev) => {
				const amt = .15;
				return {
					x: lerp(prev.x, positionX, amt),
					y: lerp(prev.y, positionY, amt)
				};
			});
			animationRef.current = requestAnimationFrame(animate);
		};
		animationRef.current = requestAnimationFrame(animate);
		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
		};
	}, [
		positionX,
		positionY,
		canHover
	]);
	const maskId1 = useId();
	const maskId2 = useId();
	const maskId3 = useId();
	return /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.checkoutSuccessRings,
		as: "svg",
		viewBox: "0 0 512 512",
		sx: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none"
		},
		"aria-hidden": true,
		children: [/* @__PURE__ */ jsxs("defs", { children: [
			/* @__PURE__ */ jsxs("radialGradient", {
				id: "clerk-checkout-success-gradient",
				children: [/* @__PURE__ */ jsx("stop", {
					offset: "0%",
					style: { stopColor: "var(--ring-highlight)" }
				}), /* @__PURE__ */ jsx("stop", {
					offset: "100%",
					stopOpacity: "0",
					style: { stopColor: "var(--ring-highlight)" }
				})]
			}),
			/* @__PURE__ */ jsx("filter", {
				id: "clerk-checkout-success-blur-effect",
				children: /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "10" })
			}),
			[
				{
					r: 225,
					maskStart: 10,
					maskEnd: 90,
					id: maskId1
				},
				{
					r: 162.5,
					maskStart: 15,
					maskEnd: 85,
					id: maskId2
				},
				{
					r: 100,
					maskStart: 20,
					maskEnd: 80,
					id: maskId3
				}
			].map(({ maskStart, maskEnd, id }) => /* @__PURE__ */ jsxs("linearGradient", {
				id: `gradient-${id}`,
				x1: "0%",
				y1: "0%",
				x2: "0%",
				y2: "100%",
				children: [
					/* @__PURE__ */ jsx("stop", {
						offset: `${maskStart + 5}%`,
						stopColor: "white",
						stopOpacity: "0"
					}),
					/* @__PURE__ */ jsx("stop", {
						offset: `${maskStart + 35}%`,
						stopColor: "white",
						stopOpacity: "1"
					}),
					/* @__PURE__ */ jsx("stop", {
						offset: `${maskEnd - 35}%`,
						stopColor: "white",
						stopOpacity: "1"
					}),
					/* @__PURE__ */ jsx("stop", {
						offset: `${maskEnd - 5}%`,
						stopColor: "white",
						stopOpacity: "0"
					})
				]
			}, id)),
			/* @__PURE__ */ jsx("mask", {
				id: "clerk-checkout-success-mask",
				children: [
					{
						r: 225,
						id: maskId1
					},
					{
						r: 162.5,
						id: maskId2
					},
					{
						r: 100,
						id: maskId3
					}
				].map(({ r, id }) => /* @__PURE__ */ jsx("circle", {
					cx: "256",
					cy: "256",
					r,
					stroke: `url(#gradient-${id})`,
					fill: "none",
					strokeWidth: "1"
				}, id))
			})
		] }), /* @__PURE__ */ jsxs("g", {
			mask: "url(#clerk-checkout-success-mask)",
			children: [/* @__PURE__ */ jsx("rect", {
				width: "512",
				height: "512",
				style: { fill: "var(--ring-fill)" }
			}), canHover && /* @__PURE__ */ jsx("rect", {
				id: "movingGradientHighlight",
				width: "256",
				height: "256",
				x: currentPosition.x - 128,
				y: currentPosition.y - 128,
				fill: "url(#clerk-checkout-success-gradient)",
				filter: "url(#clerk-checkout-success-blur-effect)"
			})]
		})]
	});
};
const CheckoutComplete = () => {
	const router = useRouter();
	const { setIsOpen } = useDrawerContext();
	const { newSubscriptionRedirectUrl } = useCheckoutContext();
	const { checkout } = __experimental_useCheckout();
	const { totals, paymentMethod, planPeriodStart, freeTrialEndsAt } = checkout;
	const [mousePosition, setMousePosition] = useState({
		x: 256,
		y: 256
	});
	const { $ } = useLocalizations();
	const prefersReducedMotion = usePrefersReducedMotion();
	const { animations: layoutAnimations } = useAppearance().parsedOptions;
	const isMotionSafe = !prefersReducedMotion && layoutAnimations === true;
	const checkoutSuccessRootRef = useRef(null);
	const canHover = typeof window === "undefined" ? true : window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	const handleMouseMove = (event) => {
		if (!canHover) return;
		if (checkoutSuccessRootRef.current) {
			const rect = checkoutSuccessRootRef.current.getBoundingClientRect();
			const domX = event.clientX - rect.left;
			const domY = event.clientY - rect.top;
			const domWidth = rect.width;
			const svgViewBoxWidth = 512;
			if (domWidth > 0) setMousePosition({
				x: domX / domWidth * svgViewBoxWidth,
				y: domY / domWidth * svgViewBoxWidth
			});
			else setMousePosition({
				x: 256,
				y: 256
			});
		}
	};
	const handleClose = () => {
		if (newSubscriptionRedirectUrl) router.navigate(newSubscriptionRedirectUrl);
		if (setIsOpen) setIsOpen(false);
	};
	if (!totals) return null;
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Drawer.Body, { children: /* @__PURE__ */ jsxs(Span, {
		elementDescriptor: descriptors.checkoutSuccessRoot,
		sx: (t) => ({
			"--ring-fill": t.colors.$neutralAlpha200,
			"--ring-highlight": t.colors.$success500,
			margin: "auto",
			position: "relative",
			aspectRatio: "1/1",
			display: "grid",
			width: "100%",
			flexShrink: 0,
			transformOrigin: "bottom center",
			animationName: "scaleIn",
			animationDuration: `${transitionDurationValues.slowest}ms`,
			animationTimingFunction: transitionTiming.bezier,
			animationFillMode: "forwards",
			opacity: 0,
			overflow: "hidden",
			backgroundColor: t.colors.$colorBackground,
			"@keyframes scaleIn": {
				"0%": {
					filter: "blur(10px)",
					transform: "scale(0.85)",
					opacity: 0
				},
				"100%": {
					filter: "blur(0px)",
					transform: "scale(1)",
					opacity: 1
				}
			},
			...!isMotionSafe && {
				animation: "none",
				opacity: 1
			}
		}),
		ref: checkoutSuccessRootRef,
		onMouseMove: handleMouseMove,
		children: [
			/* @__PURE__ */ jsx(SuccessRing, {
				positionX: mousePosition.x,
				positionY: mousePosition.y
			}),
			/* @__PURE__ */ jsxs(Box, {
				elementDescriptor: descriptors.checkoutSuccessBadge,
				sx: (t) => ({
					margin: "auto",
					gridArea: "1/1",
					display: "flex",
					position: "relative",
					width: t.sizes.$16,
					height: t.sizes.$16,
					borderRadius: t.radii.$circle,
					backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.12) 50%, rgba(0, 0, 0, 0.30) 95.31%)`,
					boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.35), 0px 1px 0px 0px rgba(255, 255, 255, 0.05) inset",
					color: canHover ? t.colors.$success500 : t.colors.$colorForeground,
					":before": {
						content: "\"\"",
						position: "absolute",
						inset: t.space.$1,
						borderRadius: t.radii.$circle,
						backgroundColor: t.colors.$colorBackground
					}
				}),
				children: [/* @__PURE__ */ jsx("svg", {
					fill: "none",
					viewBox: "0 0 10 10",
					"aria-hidden": "true",
					style: {
						position: "relative",
						margin: "auto",
						width: "1rem",
						height: "1rem"
					},
					children: /* @__PURE__ */ jsx("path", {
						d: "m1 6 3 3 5-8",
						stroke: "currentColor",
						strokeWidth: "1.25",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeDasharray: "1",
						pathLength: "1",
						style: {
							strokeDashoffset: "1",
							animation: isMotionSafe ? `check ${transitionDurationValues.drawer}ms ${transitionTiming.bezier} forwards ${transitionDurationValues.slow}ms` : "none",
							...!isMotionSafe && { strokeDashoffset: "0" }
						}
					})
				}), /* @__PURE__ */ jsx("style", { children: `
              @keyframes check {
                0% {
                  stroke-dashoffset: 1;
                }
                100% {
                  stroke-dashoffset: 0;
                }
            ` })]
			}),
			/* @__PURE__ */ jsxs(Span, {
				sx: (t) => ({
					margin: "auto",
					gridArea: "1/1",
					position: "relative",
					textAlign: "center",
					transform: `translateY(${t.space.$20})`
				}),
				children: [/* @__PURE__ */ jsx(Heading, {
					elementDescriptor: descriptors.checkoutSuccessTitle,
					as: "h2",
					textVariant: "h2",
					localizationKey: freeTrialEndsAt ? localizationKeys("billing.checkout.title__trialSuccess") : totals.totalDueNow && totals.totalDueNow.amount > 0 ? localizationKeys("billing.checkout.title__paymentSuccessful") : localizationKeys("billing.checkout.title__subscriptionSuccessful"),
					sx: (t) => ({
						opacity: 0,
						animationName: "slideUp",
						animationDuration: `${transitionDurationValues.slowest}ms`,
						animationTimingFunction: transitionTiming.bezier,
						animationFillMode: "forwards",
						color: t.colors.$colorForeground,
						"@keyframes slideUp": {
							"0%": {
								transform: "translateY(30px)",
								opacity: 0
							},
							"100%": {
								transform: "translateY(0)",
								opacity: 1
							}
						},
						...!isMotionSafe && {
							opacity: 1,
							animation: "none"
						}
					})
				}), /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.checkoutSuccessDescription,
					colorScheme: "secondary",
					sx: (t) => ({
						textAlign: "center",
						paddingInline: t.space.$8,
						marginBlockStart: t.space.$2,
						opacity: 0,
						animationName: "slideUp",
						animationDuration: `${transitionDurationValues.slowest * 1.5}ms`,
						animationTimingFunction: transitionTiming.bezier,
						animationFillMode: "forwards",
						"@keyframes slideUp": {
							"0%": {
								transform: "translateY(30px)",
								opacity: 0
							},
							"100%": {
								transform: "translateY(0)",
								opacity: 1
							}
						},
						...!isMotionSafe && {
							opacity: 1,
							animation: "none"
						}
					}),
					localizationKey: totals.totalDueNow && totals.totalDueNow.amount > 0 ? localizationKeys("billing.checkout.description__paymentSuccessful") : localizationKeys("billing.checkout.description__subscriptionSuccessful")
				})]
			})
		]
	}) }), /* @__PURE__ */ jsxs(Drawer.Footer, {
		sx: (t) => ({
			rowGap: t.space.$4,
			animationName: "footerSlideInUp",
			animationDuration: `${transitionDurationValues.drawer}ms`,
			animationTimingFunction: transitionTiming.bezier,
			"@keyframes footerSlideInUp": {
				"0%": {
					transform: "translateY(100%)",
					opacity: 0
				},
				"100%": {
					transform: "translateY(0)",
					opacity: 1
				}
			},
			...!isMotionSafe && { animation: "none" }
		}),
		children: [/* @__PURE__ */ jsxs(LineItems.Root, { children: [
			totals.totalDueNow ? /* @__PURE__ */ jsxs(LineItems.Group, {
				variant: "secondary",
				children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.checkout.lineItems.title__totalPaid") }), /* @__PURE__ */ jsx(LineItems.Description, { text: $(totals.totalDueNow) })]
			}) : null,
			freeTrialEndsAt ? /* @__PURE__ */ jsxs(LineItems.Group, {
				variant: "secondary",
				children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.checkout.lineItems.title__freeTrialEndsAt") }), /* @__PURE__ */ jsx(LineItems.Description, { text: formatDate(freeTrialEndsAt) })]
			}) : null,
			/* @__PURE__ */ jsxs(LineItems.Group, {
				variant: "secondary",
				children: [/* @__PURE__ */ jsx(LineItems.Title, { title: totals.totalDueNow && totals.totalDueNow.amount > 0 || freeTrialEndsAt !== null ? localizationKeys("billing.checkout.lineItems.title__paymentMethod") : localizationKeys("billing.checkout.lineItems.title__subscriptionBegins") }), /* @__PURE__ */ jsx(LineItems.Description, { text: totals.totalDueNow && totals.totalDueNow.amount > 0 || freeTrialEndsAt !== null ? paymentMethod ? paymentMethod.paymentType !== "card" ? paymentMethod.paymentType ? `${capitalize(paymentMethod.paymentType)}` : "–" : paymentMethod.cardType ? `${capitalize(paymentMethod.cardType)} ⋯ ${paymentMethod.last4}` : "–" : "–" : planPeriodStart ? formatDate(new Date(planPeriodStart)) : "–" })]
			})
		] }), /* @__PURE__ */ jsx(Button, {
			onClick: handleClose,
			localizationKey: localizationKeys("formButtonPrimary")
		})]
	})] });
};

//#endregion
export { CheckoutComplete };
//# sourceMappingURL=CheckoutComplete.js.map