import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flex, Spinner } from "../../customizables/index.js";
import { ProfileCardHeader } from "./elements/ProfileCard.js";
import { Step } from "./elements/Step.js";
import { Stepper } from "./elements/Stepper/Stepper.js";
import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/ConfigureSSOSkeleton.tsx
const ConfigureSSOSkeleton = () => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(ProfileCardHeader, { children: /* @__PURE__ */ jsx(Stepper.Skeleton, {}) }),
		/* @__PURE__ */ jsx(Flex, {
			align: "center",
			justify: "center",
			sx: (theme) => ({
				flex: 1,
				padding: theme.space.$5
			}),
			children: /* @__PURE__ */ jsx(Spinner, {
				size: "xs",
				colorScheme: "neutral",
				elementDescriptor: descriptors.spinner
			})
		}),
		/* @__PURE__ */ jsxs(Step.Footer, { children: [/* @__PURE__ */ jsx(Step.Footer.Previous, { isDisabled: true }), /* @__PURE__ */ jsx(Step.Footer.Continue, { isDisabled: true })] })
	] });
};

//#endregion
export { ConfigureSSOSkeleton };
//# sourceMappingURL=ConfigureSSOSkeleton.js.map