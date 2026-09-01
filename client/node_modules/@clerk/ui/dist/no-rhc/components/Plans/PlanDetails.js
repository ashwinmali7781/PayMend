import { localizationKeys } from "../../localization/localizationKeys.js";
import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flow } from "../../customizables/Flow.js";
import { Box, Col, Flex, Heading, Span, Spinner, Text } from "../../customizables/index.js";
import { Alert } from "../../elements/Alert.js";
import { Drawer } from "../../elements/Drawer.js";
import { Avatar } from "../../elements/Avatar.js";
import { Switch } from "../../elements/Switch.js";
import * as React$1 from "react";
import { useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { __internal_usePlanDetailsQuery } from "@clerk/shared/react/index";

//#region src/components/Plans/PlanDetails.tsx
const PlanDetails = (props) => {
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "planDetails",
		children: /* @__PURE__ */ jsx(Flow.Part, { children: /* @__PURE__ */ jsx(Drawer.Content, { children: /* @__PURE__ */ jsx(PlanDetailsInternal, { ...props }) }) })
	});
};
const BodyFiller = ({ children }) => {
	return /* @__PURE__ */ jsx(Drawer.Body, {
		sx: (t) => ({
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			flex: 1,
			overflowY: "auto",
			padding: t.space.$4,
			gap: t.space.$4
		}),
		children
	});
};
const PlanDetailsError = ({ error }) => {
	const { translateError } = useLocalizations();
	return /* @__PURE__ */ jsx(BodyFiller, { children: /* @__PURE__ */ jsx(Alert, {
		variant: "danger",
		colorScheme: "danger",
		children: translateError(error.errors[0])
	}) });
};
const PlanDetailsInternal = ({ planId, plan: initialPlan, initialPlanPeriod = "month" }) => {
	const [planPeriod, setPlanPeriod] = useState(initialPlanPeriod);
	const { data: plan, isLoading, error } = __internal_usePlanDetailsQuery({
		planId,
		initialPlan,
		enabled: Boolean(planId || initialPlan?.id)
	});
	if (isLoading && !initialPlan) return /* @__PURE__ */ jsx(BodyFiller, { children: /* @__PURE__ */ jsx(Spinner, {}) });
	if (!plan && error) return /* @__PURE__ */ jsx(PlanDetailsError, { error });
	if (!plan) return null;
	const features = plan.features;
	const hasFeatures = features.length > 0;
	return /* @__PURE__ */ jsxs(SubscriberTypeContext.Provider, {
		value: plan.forPayerType === "org" ? "organization" : "user",
		children: [/* @__PURE__ */ jsx(Drawer.Header, {
			sx: (t) => !hasFeatures ? {
				flex: 1,
				borderBottomWidth: 0,
				background: t.colors.$colorBackground
			} : null,
			children: /* @__PURE__ */ jsx(Header, {
				plan,
				planPeriod,
				setPlanPeriod,
				closeSlot: /* @__PURE__ */ jsx(Drawer.Close, {})
			})
		}), hasFeatures ? /* @__PURE__ */ jsxs(Drawer.Body, { children: [/* @__PURE__ */ jsx(Text, {
			elementDescriptor: descriptors.planDetailCaption,
			variant: "caption",
			localizationKey: localizationKeys("billing.availableFeatures"),
			colorScheme: "secondary",
			sx: (t) => ({
				padding: t.space.$4,
				paddingBottom: 0
			})
		}), /* @__PURE__ */ jsx(Box, {
			elementDescriptor: descriptors.planDetailFeaturesList,
			as: "ul",
			role: "list",
			sx: (t) => ({
				display: "grid",
				rowGap: t.space.$6,
				padding: t.space.$4,
				margin: 0
			}),
			children: features.map((feature) => /* @__PURE__ */ jsxs(Box, {
				elementDescriptor: descriptors.planDetailFeaturesListItem,
				as: "li",
				sx: (t) => ({
					display: "flex",
					alignItems: "baseline",
					gap: t.space.$3
				}),
				children: [feature.avatarUrl ? /* @__PURE__ */ jsx(Avatar, {
					size: (_) => 24,
					title: feature.name,
					initials: feature.name[0],
					rounded: false,
					imageUrl: feature.avatarUrl
				}) : null, /* @__PURE__ */ jsxs(Span, {
					elementDescriptor: descriptors.planDetailFeaturesListItemContent,
					children: [/* @__PURE__ */ jsx(Text, {
						elementDescriptor: descriptors.planDetailFeaturesListItemTitle,
						colorScheme: "body",
						sx: (t) => ({ fontWeight: t.fontWeights.$medium }),
						children: feature.name
					}), feature.description ? /* @__PURE__ */ jsx(Text, {
						elementDescriptor: descriptors.planDetailFeaturesListItemDescription,
						colorScheme: "secondary",
						sx: (t) => ({ marginBlockStart: t.space.$0x25 }),
						children: feature.description
					}) : null]
				})]
			}, feature.id))
		})] }) : null]
	});
};
const Header = React$1.forwardRef((props, ref) => {
	const { plan, closeSlot, planPeriod, setPlanPeriod } = props;
	const { $ } = useLocalizations();
	const fee = useMemo(() => {
		if (!plan.annualMonthlyFee) return plan.fee;
		return planPeriod === "annual" ? plan.annualMonthlyFee : plan.fee;
	}, [plan, planPeriod]);
	const feeFormatted = React$1.useMemo(() => {
		if (!fee) return "";
		return $(fee, { style: "short" });
	}, [fee, $]);
	return /* @__PURE__ */ jsxs(Box, {
		ref,
		elementDescriptor: descriptors.planDetailHeader,
		sx: (t) => ({
			width: "100%",
			padding: t.space.$4,
			position: "relative"
		}),
		children: [
			closeSlot ? /* @__PURE__ */ jsx(Box, {
				sx: (t) => ({
					position: "absolute",
					top: t.space.$2,
					insetInlineEnd: t.space.$2
				}),
				children: closeSlot
			}) : null,
			/* @__PURE__ */ jsxs(Col, {
				gap: 3,
				elementDescriptor: descriptors.planDetailBadgeAvatarTitleDescriptionContainer,
				children: [plan.avatarUrl ? /* @__PURE__ */ jsx(Avatar, {
					boxElementDescriptor: descriptors.planDetailAvatar,
					size: (_) => 40,
					title: plan.name,
					initials: plan.name[0],
					rounded: false,
					imageUrl: plan.avatarUrl,
					sx: (t) => ({ marginBlockEnd: t.space.$3 })
				}) : null, /* @__PURE__ */ jsxs(Col, {
					gap: 1,
					elementDescriptor: descriptors.planDetailTitleDescriptionContainer,
					children: [/* @__PURE__ */ jsx(Heading, {
						elementDescriptor: descriptors.planDetailTitle,
						as: "h2",
						textVariant: "h2",
						children: plan.name
					}), plan.description ? /* @__PURE__ */ jsx(Text, {
						elementDescriptor: descriptors.planDetailDescription,
						variant: "subtitle",
						colorScheme: "secondary",
						children: plan.description
					}) : null]
				})]
			}),
			/* @__PURE__ */ jsx(Flex, {
				elementDescriptor: descriptors.planDetailFeeContainer,
				align: "center",
				wrap: "wrap",
				sx: (t) => ({
					marginTop: t.space.$3,
					columnGap: t.space.$1x5
				}),
				children: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.planDetailFee,
					variant: "h1",
					colorScheme: "body",
					children: feeFormatted
				}), /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.planDetailFeePeriod,
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
				})] })
			}),
			/* @__PURE__ */ jsx(PeriodToggle, {
				plan,
				planPeriod,
				setPlanPeriod
			})
		]
	});
});
const PeriodToggle = ({ plan, planPeriod, setPlanPeriod }) => {
	if (plan.fee && plan.annualMonthlyFee) return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.planDetailPeriodToggle,
		sx: (t) => ({
			display: "flex",
			marginTop: t.space.$3
		}),
		children: /* @__PURE__ */ jsx(Switch, {
			isChecked: planPeriod === "annual",
			onChange: (checked) => setPlanPeriod(checked ? "annual" : "month"),
			label: localizationKeys("billing.billedAnnually")
		})
	});
	if (plan.annualMonthlyFee) return /* @__PURE__ */ jsx(Text, {
		elementDescriptor: descriptors.pricingTableCardFeePeriodNotice,
		variant: "caption",
		colorScheme: "secondary",
		localizationKey: plan.isDefault ? localizationKeys("billing.alwaysFree") : localizationKeys("billing.billedAnnuallyOnly"),
		sx: (t) => ({
			justifySelf: "flex-start",
			alignSelf: "center",
			marginTop: t.space.$3
		})
	});
	return /* @__PURE__ */ jsx(Text, {
		elementDescriptor: descriptors.pricingTableCardFeePeriodNotice,
		variant: "caption",
		colorScheme: "secondary",
		localizationKey: plan.isDefault ? localizationKeys("billing.alwaysFree") : localizationKeys("billing.billedMonthlyOnly"),
		sx: (t) => ({
			justifySelf: "flex-start",
			alignSelf: "center",
			marginTop: t.space.$3
		})
	});
};

//#endregion
export { PlanDetails };
//# sourceMappingURL=PlanDetails.js.map