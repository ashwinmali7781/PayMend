import { localizationKeys } from "../../../localization/localizationKeys.js";
import SvgChevronRight from "../../../icons/chevron-right.js";
import SvgDuotoneShieldCheck from "../../../icons/duotone-shield-check.js";
import { descriptors } from "../../../customizables/elementDescriptors.js";
import { useCardState } from "../../../elements/contexts/index.js";
import { Flow } from "../../../customizables/Flow.js";
import { Button, Col, Flex, Heading, Icon, Text } from "../../../customizables/index.js";
import { Alert } from "../../../elements/Alert.js";
import { handleError } from "../../../utils/errorHandler.js";
import { useConfigureSSO } from "../ConfigureSSOContext.js";
import { Step } from "../elements/Step.js";
import { useClerk, useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { eventFlowStepMounted } from "@clerk/shared/telemetry";

//#region src/components/ConfigureSSO/steps/ActivateStep.tsx
const ActivateStep = () => {
	const { enterpriseConnection, organizationEnterpriseConnection, enterpriseConnectionMutations: { setConnectionActive }, onExit } = useConfigureSSO();
	const card = useCardState();
	const clerk = useClerk();
	const { organization } = useOrganization();
	const domain = (enterpriseConnection?.domains ?? []).join(", ");
	const isActive = organizationEnterpriseConnection.isActive;
	const handleActivate = async () => {
		if (!enterpriseConnection || card.isLoading) return;
		card.setError(void 0);
		card.setLoading();
		try {
			await setConnectionActive(enterpriseConnection.id, true);
			clerk.telemetry?.record(eventFlowStepMounted("configureSSO", "activate", {
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				connectionStatus: "active",
				connectionId: enterpriseConnection.id,
				organizationId: organization?.id ?? null
			}));
			onExit?.();
		} catch (err) {
			handleError(err, [], card.setError);
		} finally {
			card.setIdle();
		}
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "ssoActivate",
		children: /* @__PURE__ */ jsx(Step, {
			elementDescriptor: descriptors.configureSSOStep,
			elementId: descriptors.configureSSOStep.setId("activate"),
			children: /* @__PURE__ */ jsx(Step.Body, { children: /* @__PURE__ */ jsxs(Step.Section, {
				elementDescriptor: descriptors.configureSSOActivate,
				fill: true,
				gap: 5,
				sx: {
					alignItems: "center",
					justifyContent: "center"
				},
				children: [/* @__PURE__ */ jsxs(Col, {
					align: "center",
					sx: (t) => ({
						textAlign: "center",
						maxWidth: "20.75rem",
						gap: t.space.$3x5
					}),
					children: [
						/* @__PURE__ */ jsx(Icon, {
							elementDescriptor: descriptors.configureSSOActivateIcon,
							icon: SvgDuotoneShieldCheck,
							colorScheme: "neutral",
							sx: (t) => ({
								width: t.sizes.$8,
								height: t.sizes.$8
							})
						}),
						/* @__PURE__ */ jsxs(Col, {
							align: "center",
							gap: 2,
							children: [/* @__PURE__ */ jsx(Heading, {
								elementDescriptor: descriptors.configureSSOActivateTitle,
								textVariant: "h2",
								localizationKey: localizationKeys(isActive ? "configureSSO.activate.activeTitle" : "configureSSO.activate.title")
							}), /* @__PURE__ */ jsx(Text, {
								elementDescriptor: descriptors.configureSSOActivateSubtitle,
								as: "p",
								colorScheme: "secondary",
								localizationKey: localizationKeys(isActive ? "configureSSO.activate.activeSubtitle" : "configureSSO.activate.subtitle", { domain })
							})]
						}),
						card.error && /* @__PURE__ */ jsx(Alert, {
							variant: "danger",
							sx: { width: "100%" },
							title: card.error
						})
					]
				}), isActive ? /* @__PURE__ */ jsx(Button, {
					elementDescriptor: descriptors.configureSSOActivateButton,
					variant: "bordered",
					colorScheme: "secondary",
					size: "sm",
					onClick: () => onExit?.(),
					localizationKey: localizationKeys("configureSSO.activate.doneButton")
				}) : /* @__PURE__ */ jsxs(Flex, {
					align: "center",
					gap: 4,
					children: [/* @__PURE__ */ jsx(Button, {
						elementDescriptor: descriptors.configureSSOActivateButton,
						variant: "solid",
						size: "sm",
						isLoading: card.isLoading,
						onClick: () => void handleActivate(),
						localizationKey: localizationKeys("configureSSO.activate.activateButton")
					}), /* @__PURE__ */ jsxs(Button, {
						elementDescriptor: descriptors.configureSSOActivateSkipButton,
						variant: "outline",
						size: "sm",
						isDisabled: card.isLoading,
						onClick: () => onExit?.(),
						children: [/* @__PURE__ */ jsx(Text, {
							as: "span",
							localizationKey: localizationKeys("configureSSO.activate.skipButton")
						}), /* @__PURE__ */ jsx(Icon, {
							icon: SvgChevronRight,
							size: "sm",
							sx: (t) => ({ marginInlineStart: t.space.$1 })
						})]
					})]
				})]
			}) })
		})
	});
};

//#endregion
export { ActivateStep };
//# sourceMappingURL=ActivateStep.js.map