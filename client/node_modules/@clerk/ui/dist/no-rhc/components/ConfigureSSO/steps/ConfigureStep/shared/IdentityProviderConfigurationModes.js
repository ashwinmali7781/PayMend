import { useLocalizations } from "../../../../../localization/makeLocalizable.js";
import { SegmentedControl } from "../../../../../elements/SegmentedControl.js";
import "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/ConfigureStep/shared/IdentityProviderConfigurationModes.tsx
const IdentityProviderConfigurationModes = ({ modes, value, onChange, labels }) => {
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsx(SegmentedControl.Root, {
		"aria-label": t(labels.ariaLabel),
		value,
		onChange: (next) => onChange(next),
		fullWidth: true,
		size: "lg",
		children: modes.map((mode) => {
			const label = labels[mode];
			if (!label) return null;
			return /* @__PURE__ */ jsx(SegmentedControl.Button, {
				value: mode,
				text: label
			}, mode);
		})
	});
};

//#endregion
export { IdentityProviderConfigurationModes };
//# sourceMappingURL=IdentityProviderConfigurationModes.js.map