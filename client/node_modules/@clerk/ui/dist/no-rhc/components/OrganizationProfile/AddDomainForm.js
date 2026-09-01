import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { VerifyDomainForm } from "./VerifyDomainForm.js";
import React, { useState } from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/AddDomainForm.tsx
const AddDomainForm = withCardStateProvider((props) => {
	const { onSuccess, onReset } = props;
	const { organizationSettings } = useEnvironment();
	const { domains } = useOrganization({ domains: { infinite: true } });
	const wizard = useWizard({ onNextStep: () => card.setError(void 0) });
	const [domainId, setDomainId] = useState("");
	const [verified, setVerified] = useState(false);
	const title = localizationKeys("organizationProfile.createDomainPage.title");
	const subtitle = localizationKeys("organizationProfile.createDomainPage.subtitle");
	const card = useCardState();
	const { organization } = useOrganization();
	const nameField = useFormControl("name", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__organizationDomain"),
		placeholder: localizationKeys("formFieldInputPlaceholder__organizationDomain")
	});
	if (!organization || !organizationSettings) return null;
	const canSubmit = nameField.value.trim() !== "";
	const onSubmit = (e) => {
		nameField.clearFeedback();
		e.preventDefault();
		return organization.createDomain(nameField.value).then(async (res) => {
			setDomainId(res.id);
			domains?.revalidate?.();
			if (res.verification && res.verification.status === "verified") setVerified(true);
			wizard.nextStep();
		}).catch((err) => {
			handleError(err, [nameField], card.setError);
		});
	};
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsx(FormContainer, {
			headerTitle: title,
			headerSubtitle: subtitle,
			children: /* @__PURE__ */ jsxs(Form.Root, {
				onSubmit,
				children: [/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: nameField.id,
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...nameField.props,
						autoFocus: true,
						ignorePasswordManager: true,
						isRequired: true
					})
				}), /* @__PURE__ */ jsx(FormButtons, {
					isDisabled: !canSubmit,
					onReset
				})]
			})
		}), /* @__PURE__ */ jsx(VerifyDomainForm, {
			domainId,
			onSuccess: () => {
				domains?.revalidate?.();
				onSuccess?.();
			},
			skipToVerified: verified,
			onReset
		})]
	});
});

//#endregion
export { AddDomainForm };
//# sourceMappingURL=AddDomainForm.js.map