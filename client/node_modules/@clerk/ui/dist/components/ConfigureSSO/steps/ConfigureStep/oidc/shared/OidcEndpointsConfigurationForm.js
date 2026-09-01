import { Text } from "../../../../../../customizables/index.js";
import { Form } from "../../../../../../elements/Form.js";
import "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/ConfigureStep/oidc/shared/OidcEndpointsConfigurationForm.tsx
const OidcEndpointsConfigurationForm = (props) => {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Text, {
		as: "p",
		colorScheme: "secondary",
		localizationKey: props.labels.description
	}), props.mode === "discoveryUrl" ? /* @__PURE__ */ jsx(Form.ControlRow, {
		elementId: props.form.discoveryUrlField.id,
		children: /* @__PURE__ */ jsx(Form.PlainInput, { ...props.form.discoveryUrlField.props })
	}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(Form.ControlRow, {
			elementId: props.form.authUrlField.id,
			children: /* @__PURE__ */ jsx(Form.PlainInput, { ...props.form.authUrlField.props })
		}),
		/* @__PURE__ */ jsx(Form.ControlRow, {
			elementId: props.form.tokenUrlField.id,
			children: /* @__PURE__ */ jsx(Form.PlainInput, { ...props.form.tokenUrlField.props })
		}),
		/* @__PURE__ */ jsx(Form.ControlRow, {
			elementId: props.form.userInfoUrlField.id,
			children: /* @__PURE__ */ jsx(Form.PlainInput, { ...props.form.userInfoUrlField.props })
		})
	] })] });
};

//#endregion
export { OidcEndpointsConfigurationForm };
//# sourceMappingURL=OidcEndpointsConfigurationForm.js.map