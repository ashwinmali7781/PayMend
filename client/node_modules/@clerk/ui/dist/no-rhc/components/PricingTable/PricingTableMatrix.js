import { localizationKeys } from "../../localization/localizationKeys.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import SvgCheckmark from "../../icons/checkmark.js";
import SvgInformationCircle from "../../icons/information-circle.js";
import { usePlansContext } from "../../contexts/components/Plans.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { colors } from "../../utils/colors/index.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { InternalThemeProvider } from "../../styledSystem/InternalThemeProvider.js";
import { common } from "../../styledSystem/common.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Badge, Box, Button, Flex, Heading, Icon, Span, Text } from "../../customizables/index.js";
import { SegmentedControl } from "../../elements/SegmentedControl.js";
import { Avatar } from "../../elements/Avatar.js";
import * as React$1 from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { inertProps } from "@clerk/shared/inert";

//#region src/components/PricingTable/PricingTableMatrix.tsx
function PricingTableMatrix({ plans = [], planPeriod, setPlanPeriod, onSelect, highlightedPlan }) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { animations: layoutAnimations } = useAppearance().parsedOptions;
	const isMotionSafe = !prefersReducedMotion && layoutAnimations === true;
	const segmentedControlId = `${React$1.useId()}-segmented-control`;
	const { buttonPropsForPlan } = usePlansContext();
	const { t, $ } = useLocalizations();
	const feePeriodNoticeAnimation = (t) => ({ transition: isMotionSafe ? `grid-template-rows ${t.transitionDuration.$slower} ${t.transitionTiming.$slowBezier}` : "none" });
	const highlightBackgroundColor = (t) => ({ background: common.mergedColorsBackground(colors.setAlpha(t.colors.$colorBackground, 1), t.colors.$neutralAlpha25) });
	const gridTemplateColumns = React$1.useMemo(() => `repeat(${plans.length + 1}, minmax(9.375rem,1fr))`, [plans.length]);
	const renderBillingCycleControls = React$1.useMemo(() => plans.some((plan) => Boolean(plan.annualMonthlyFee)), [plans]);
	const getAllFeatures = React$1.useMemo(() => {
		const featuresSet = /* @__PURE__ */ new Set();
		plans.forEach(({ features }) => {
			features.forEach(({ name }) => featuresSet.add(name));
		});
		return Array.from(featuresSet);
	}, [plans]);
	if (!plans.length) return null;
	return /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.pricingTableMatrix,
		sx: (t) => ({
			position: "relative",
			minWidth: "100%",
			display: "grid",
			isolation: "isolate",
			backgroundColor: t.colors.$colorBackground,
			[mqu.md]: { overflowX: "auto" }
		}),
		children: /* @__PURE__ */ jsxs(Box, {
			elementDescriptor: descriptors.pricingTableMatrixTable,
			role: "table",
			children: [/* @__PURE__ */ jsx(Box, {
				elementDescriptor: [descriptors.pricingTableMatrixRowGroup, descriptors.pricingTableMatrixRowGroupHeader],
				role: "rowgroup",
				sx: (t) => ({
					position: "sticky",
					top: 0,
					backgroundColor: t.colors.$colorBackground,
					borderBottomWidth: t.borderWidths.$normal,
					borderBottomStyle: t.borderStyles.$solid,
					borderBottomColor: t.colors.$borderAlpha100,
					zIndex: 1
				}),
				children: /* @__PURE__ */ jsxs(Box, {
					elementDescriptor: [descriptors.pricingTableMatrixRow, descriptors.pricingTableMatrixRowHeader],
					role: "row",
					sx: {
						display: "grid",
						gridTemplateColumns
					},
					children: [/* @__PURE__ */ jsx(Box, {
						elementDescriptor: descriptors.pricingTableMatrixColumnHeader,
						role: "columnheader",
						sx: (t) => ({
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							justifyContent: "flex-end",
							rowGap: t.space.$3,
							paddingBlockEnd: t.space.$12,
							paddingInlineStart: t.space.$3
						}),
						children: renderBillingCycleControls ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Text, {
							id: segmentedControlId,
							colorScheme: "secondary",
							variant: "caption",
							localizationKey: localizationKeys("billing.pricingTable.billingCycle"),
							children: "Billing cycle"
						}), /* @__PURE__ */ jsxs(SegmentedControl.Root, {
							"aria-labelledby": segmentedControlId,
							value: planPeriod,
							onChange: (value) => setPlanPeriod(value),
							children: [/* @__PURE__ */ jsx(SegmentedControl.Button, {
								value: "month",
								text: localizationKeys("billing.monthly")
							}), /* @__PURE__ */ jsx(SegmentedControl.Button, {
								value: "annual",
								text: localizationKeys("billing.annually")
							})]
						})] }) : null
					}), plans.map((plan) => {
						const highlight = plan.slug === highlightedPlan;
						const planFee = !plan.annualMonthlyFee ? plan.fee : planPeriod === "annual" ? plan.annualMonthlyFee : plan.fee;
						return /* @__PURE__ */ jsxs(Box, {
							elementDescriptor: descriptors.pricingTableMatrixColumnHeader,
							role: "columnheader",
							sx: [(t) => ({
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
								flex: 1,
								borderStartStartRadius: t.radii.$xl,
								borderStartEndRadius: t.radii.$xl
							}), highlight && highlightBackgroundColor],
							"data-highlighted": highlight,
							children: [/* @__PURE__ */ jsxs(Box, {
								sx: (t) => ({
									width: "100%",
									padding: t.space.$4
								}),
								children: [
									plan.avatarUrl || highlight ? /* @__PURE__ */ jsxs(Span, {
										sx: (t) => ({
											width: "100%",
											display: "flex",
											alignItems: "flex-start",
											justifyContent: "space-between",
											marginBlockEnd: t.space.$3
										}),
										children: [plan.avatarUrl ? /* @__PURE__ */ jsx(Avatar, {
											elementDescriptor: descriptors.pricingTableMatrixAvatar,
											size: (_) => 40,
											title: plan.name,
											initials: plan.name[0],
											rounded: false,
											imageUrl: plan.avatarUrl
										}) : null, highlight ? /* @__PURE__ */ jsx(Badge, {
											elementDescriptor: descriptors.pricingTableMatrixBadge,
											colorScheme: "secondary",
											localizationKey: localizationKeys("billing.highlightedPlanBadge")
										}) : null]
									}) : null,
									/* @__PURE__ */ jsx(Heading, {
										elementDescriptor: descriptors.pricingTableMatrixPlanName,
										textVariant: "h3",
										children: plan.name
									}),
									/* @__PURE__ */ jsx(Flex, {
										align: "center",
										wrap: "wrap",
										sx: (t) => ({
											marginTop: t.space.$2,
											columnGap: t.space.$1x5
										}),
										children: plan.hasBaseFee ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
											/* @__PURE__ */ jsx(Text, {
												elementDescriptor: descriptors.pricingTableMatrixFee,
												variant: "h2",
												colorScheme: "body",
												children: $(planFee)
											}),
											/* @__PURE__ */ jsx(Text, {
												elementDescriptor: descriptors.pricingTableMatrixFeePeriod,
												variant: "caption",
												colorScheme: "secondary",
												sx: (t) => ({
													textTransform: "lowercase",
													":before": {
														content: "\"/\"",
														marginInlineEnd: t.space.$1
													}
												}),
												localizationKey: localizationKeys("billing.month")
											}),
											plan.annualMonthlyFee ? /* @__PURE__ */ jsx(Box, {
												elementDescriptor: descriptors.pricingTableMatrixFeePeriodNotice,
												sx: [(_) => ({
													width: "100%",
													display: "grid",
													gridTemplateRows: planPeriod === "annual" ? "1fr" : "0fr"
												}), feePeriodNoticeAnimation],
												...inertProps(planPeriod !== "annual"),
												children: /* @__PURE__ */ jsx(Box, {
													elementDescriptor: descriptors.pricingTableMatrixFeePeriodNoticeInner,
													sx: {
														overflow: "hidden",
														minHeight: 0
													},
													children: /* @__PURE__ */ jsxs(Text, {
														elementDescriptor: descriptors.pricingTableMatrixFeePeriodNoticeLabel,
														variant: "caption",
														colorScheme: "secondary",
														sx: (t) => ({
															width: "100%",
															display: "flex",
															alignItems: "center",
															columnGap: t.space.$1
														}),
														children: [
															/* @__PURE__ */ jsx(Icon, {
																icon: SvgInformationCircle,
																colorScheme: "neutral",
																size: "sm",
																"aria-hidden": true
															}),
															" ",
															/* @__PURE__ */ jsx(Span, { localizationKey: localizationKeys("billing.billedAnnually") })
														]
													})
												})
											}) : null
										] }) : /* @__PURE__ */ jsx(Text, {
											elementDescriptor: descriptors.pricingTableMatrixFee,
											variant: "h2",
											localizationKey: localizationKeys("billing.free"),
											colorScheme: "body"
										})
									})
								]
							}), !plan.isDefault ? /* @__PURE__ */ jsx(Box, {
								sx: (t) => ({
									width: "100%",
									marginBlockStart: "auto",
									marginBlockEnd: t.space.$8,
									paddingBlockStart: t.space.$2,
									paddingBlockEnd: t.space.$4,
									paddingInline: t.space.$4
								}),
								children: /* @__PURE__ */ jsx(Button, {
									block: true,
									textVariant: "buttonSmall",
									size: "xs",
									onClick: (event) => {
										onSelect(plan, event);
									},
									...buttonPropsForPlan({
										plan,
										selectedPlanPeriod: planPeriod
									}),
									colorScheme: highlight ? "primary" : "secondary"
								})
							}) : null]
						}, plan.slug);
					})]
				})
			}), /* @__PURE__ */ jsxs(Box, {
				elementDescriptor: [descriptors.pricingTableMatrixRowGroup, descriptors.pricingTableMatrixRowGroupBody],
				role: "rowgroup",
				children: [getAllFeatures.map((feature) => {
					return /* @__PURE__ */ jsxs(Box, {
						elementDescriptor: [descriptors.pricingTableMatrixRow, descriptors.pricingTableMatrixRowBody],
						role: "row",
						sx: (t) => ({
							position: "relative",
							display: "grid",
							gridTemplateColumns,
							borderBottomWidth: t.borderWidths.$normal,
							borderBottomStyle: t.borderStyles.$solid,
							borderBottomColor: t.colors.$borderAlpha100,
							":after": {
								content: "\"\"",
								position: "absolute",
								inset: 0,
								pointerEvents: "none",
								backgroundColor: t.colors.$neutralAlpha25,
								opacity: 0
							},
							":hover:after": { opacity: 1 }
						}),
						children: [/* @__PURE__ */ jsx(Box, {
							elementDescriptor: descriptors.pricingTableMatrixCell,
							role: "cell",
							sx: (t) => ({ padding: t.space.$3 }),
							children: /* @__PURE__ */ jsx(Text, {
								colorScheme: "body",
								children: feature
							})
						}), plans.map((plan) => {
							const highlight = plan.slug === highlightedPlan;
							const hasFeature = plan.features.some((f) => f.name === feature);
							return /* @__PURE__ */ jsx(Box, {
								elementDescriptor: descriptors.pricingTableMatrixCell,
								role: "cell",
								sx: [(t) => ({
									display: "grid",
									placeContent: "center",
									padding: t.space.$3
								}), highlight && highlightBackgroundColor],
								"data-highlighted": highlight,
								"data-checked": hasFeature,
								children: hasFeature && /* @__PURE__ */ jsx(Icon, {
									icon: SvgCheckmark,
									colorScheme: "neutral",
									size: "sm",
									"aria-label": t(localizationKeys("billing.pricingTable.included"))
								})
							}, plan.slug);
						})]
					}, feature);
				}), /* @__PURE__ */ jsxs(Box, {
					elementDescriptor: descriptors.pricingTableMatrixFooter,
					sx: {
						display: "grid",
						gridTemplateColumns
					},
					children: [/* @__PURE__ */ jsx(Box, { elementDescriptor: [descriptors.pricingTableMatrixCell, descriptors.pricingTableMatrixCellFooter] }), plans.map((plan) => {
						const highlight = plan.slug === highlightedPlan;
						return /* @__PURE__ */ jsx(Box, {
							elementDescriptor: [descriptors.pricingTableMatrixCell, descriptors.pricingTableMatrixCellFooter],
							sx: [(t) => ({
								height: t.space.$10,
								borderEndStartRadius: t.radii.$xl,
								borderEndEndRadius: t.radii.$xl
							}), highlight && highlightBackgroundColor],
							"data-highlighted": highlight
						}, plan.slug);
					})]
				})]
			})]
		})
	}) });
}

//#endregion
export { PricingTableMatrix };
//# sourceMappingURL=PricingTableMatrix.js.map