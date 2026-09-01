import { useLocalizations } from "../../localization/makeLocalizable.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { Flex } from "../../customizables/index.js";
import { useUnsafeModalContext } from "../../elements/Modal.js";
import { ProfileCardHeader } from "./elements/ProfileCard.js";
import { Stepper } from "./elements/Stepper/Stepper.js";
import { useWizard } from "./elements/Wizard/WizardContext.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/ConfigureSSOHeader.tsx
const ConfigureSSOHeader = ({ title }) => {
	const { activeSteps, currentIndex, goToStep } = useWizard();
	const { t } = useLocalizations();
	const { toggle } = useUnsafeModalContext();
	const isModal = Boolean(toggle);
	const visibleSteps = activeSteps.filter((step) => step.label);
	const currentVisibleIndex = visibleSteps.findIndex((step) => activeSteps[currentIndex]?.id === step.id);
	return /* @__PURE__ */ jsxs(ProfileCardHeader, { children: [title, /* @__PURE__ */ jsx(Flex, {
		sx: (t) => ({
			...title ? {
				marginInlineStart: "auto",
				[mqu.md]: { marginInlineStart: 0 }
			} : {},
			...isModal ? { marginInlineEnd: t.space.$10 } : {}
		}),
		children: /* @__PURE__ */ jsx(Stepper, { children: visibleSteps.map((step, index) => {
			const isCurrent = index === currentVisibleIndex;
			const labelText = step.label ? typeof step.label === "string" ? step.label : t(step.label) : "";
			return /* @__PURE__ */ jsx(Stepper.Item, {
				bullet: index + 1,
				isCurrent,
				isCompleted: step.isCompleted,
				isReachable: step.isReachable,
				onClick: () => goToStep(step.id),
				children: labelText
			}, step.id);
		}) })
	})] });
};

//#endregion
export { ConfigureSSOHeader };
//# sourceMappingURL=ConfigureSSOHeader.js.map