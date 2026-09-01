import { useAPIKeysContext } from "../../contexts/components/APIKeys.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgChevronUpDown from "../../icons/chevron-up-down.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Box, Col, FormLabel, Text } from "../../customizables/index.js";
import { Select, SelectButton, SelectOptionList } from "../../elements/Select.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import React, { useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/APIKeys/CreateAPIKeyForm.tsx
const EXPIRATION_VALUES = [
	"never",
	"1d",
	"7d",
	"30d",
	"60d",
	"90d",
	"180d",
	"1y"
];
const EXPIRATION_DURATIONS = {
	"1d": (date) => date.setDate(date.getDate() + 1),
	"7d": (date) => date.setDate(date.getDate() + 7),
	"30d": (date) => date.setDate(date.getDate() + 30),
	"60d": (date) => date.setDate(date.getDate() + 60),
	"90d": (date) => date.setDate(date.getDate() + 90),
	"180d": (date) => date.setDate(date.getDate() + 180),
	"1y": (date) => date.setFullYear(date.getFullYear() + 1)
};
const getExpirationLocalizationKey = (expiration) => {
	switch (expiration) {
		case "never": return "apiKeys.formFieldOption__expiration__never";
		case "1d": return "apiKeys.formFieldOption__expiration__1d";
		case "7d": return "apiKeys.formFieldOption__expiration__7d";
		case "30d": return "apiKeys.formFieldOption__expiration__30d";
		case "60d": return "apiKeys.formFieldOption__expiration__60d";
		case "90d": return "apiKeys.formFieldOption__expiration__90d";
		case "180d": return "apiKeys.formFieldOption__expiration__180d";
		case "1y": return "apiKeys.formFieldOption__expiration__1y";
	}
};
const getTimeLeftInSeconds = (expirationOption) => {
	if (expirationOption === "never" || !expirationOption) return;
	const now = /* @__PURE__ */ new Date();
	const future = new Date(now);
	EXPIRATION_DURATIONS[expirationOption](future);
	return Math.floor((future.getTime() - now.getTime()) / 1e3);
};
const ExpirationSelector = ({ selectedExpiration, setSelectedExpiration }) => {
	const buttonRef = useRef(null);
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsxs(Select, {
		elementId: "apiKeyExpiration",
		options: EXPIRATION_VALUES.map((value) => ({
			value,
			label: t(localizationKeys(getExpirationLocalizationKey(value)))
		})),
		value: selectedExpiration?.value ?? "",
		onChange: setSelectedExpiration,
		placeholder: t(localizationKeys("formFieldInputPlaceholder__apiKeyExpirationDate")),
		referenceElement: buttonRef,
		children: [/* @__PURE__ */ jsx(SelectButton, {
			ref: buttonRef,
			icon: SvgChevronUpDown,
			sx: (t) => ({
				justifyContent: "space-between",
				backgroundColor: t.colors.$colorBackground
			}),
			"aria-labelledby": "expiration-field",
			id: "expiration-field"
		}), /* @__PURE__ */ jsx(SelectOptionList, { sx: (t) => ({
			paddingBlock: t.space.$1,
			color: t.colors.$colorForeground
		}) })]
	});
};
const CreateAPIKeyForm = ({ onCreate }) => {
	const [selectedExpiration, setSelectedExpiration] = useState(null);
	const { close: closeCardFn } = useActionContext();
	const { showDescription = false } = useAPIKeysContext();
	const card = useCardState();
	const { t } = useLocalizations();
	const nameField = useFormControl("name", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__apiKeyName"),
		placeholder: localizationKeys("formFieldInputPlaceholder__apiKeyName"),
		isRequired: true
	});
	const descriptionField = useFormControl("apiKeyDescription", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__apiKeyDescription"),
		placeholder: localizationKeys("formFieldInputPlaceholder__apiKeyDescription"),
		isRequired: false
	});
	const canSubmit = nameField.value.length > 2;
	const expirationCaption = useMemo(() => {
		const timeLeftInSeconds = getTimeLeftInSeconds(selectedExpiration?.value);
		if (!selectedExpiration?.value || !timeLeftInSeconds) return t(localizationKeys("apiKeys.formFieldCaption__expiration__never"));
		return t(localizationKeys("apiKeys.formFieldCaption__expiration__expiresOn", { date: new Date(Date.now() + timeLeftInSeconds * 1e3).toLocaleString(void 0, {
			year: "numeric",
			month: "long",
			day: "2-digit",
			hour: "numeric",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
			timeZoneName: "short"
		}) }));
	}, [selectedExpiration?.value]);
	const handleSubmit = (e) => {
		e.preventDefault();
		onCreate({
			name: nameField.value,
			description: descriptionField.value || void 0,
			secondsUntilExpiration: getTimeLeftInSeconds(selectedExpiration?.value)
		});
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: localizationKeys("apiKeys.formTitle"),
		headerSubtitle: localizationKeys("apiKeys.formHint"),
		elementDescriptor: descriptors.apiKeysCreateForm,
		children: /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit: handleSubmit,
			children: [
				/* @__PURE__ */ jsxs(Box, {
					sx: (t) => ({
						gap: t.space.$4,
						display: "flex",
						flexDirection: "row",
						[mqu.sm]: { flexDirection: "column" }
					}),
					children: [/* @__PURE__ */ jsx(Form.ControlRow, {
						sx: { flex: 1 },
						elementId: nameField.id,
						elementDescriptor: descriptors.apiKeysCreateFormNameInput,
						children: /* @__PURE__ */ jsx(Form.PlainInput, { ...nameField.props })
					}), /* @__PURE__ */ jsxs(Col, {
						sx: {
							flex: 1,
							width: "100%"
						},
						gap: 2,
						elementDescriptor: descriptors.apiKeysCreateFormExpirationInput,
						children: [
							/* @__PURE__ */ jsxs(FormLabel, {
								sx: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									flexDirection: "row"
								},
								htmlFor: "expiration-field",
								children: [/* @__PURE__ */ jsx(Text, {
									as: "span",
									variant: "subtitle",
									localizationKey: localizationKeys("formFieldLabel__apiKeyExpiration")
								}), /* @__PURE__ */ jsx(Text, {
									variant: "caption",
									colorScheme: "secondary",
									localizationKey: localizationKeys("formFieldHintText__optional")
								})]
							}),
							/* @__PURE__ */ jsx(ExpirationSelector, {
								selectedExpiration,
								setSelectedExpiration
							}),
							/* @__PURE__ */ jsx(Text, {
								variant: "caption",
								colorScheme: "secondary",
								localizationKey: expirationCaption,
								elementDescriptor: descriptors.apiKeysCreateFormExpirationCaption
							})
						]
					})]
				}),
				showDescription && /* @__PURE__ */ jsx(Col, {
					sx: (t) => ({
						borderTopWidth: t.borderWidths.$normal,
						borderTopStyle: t.borderStyles.$solid,
						borderTopColor: t.colors.$borderAlpha100,
						paddingTop: t.space.$4,
						paddingBottom: t.space.$4
					}),
					children: /* @__PURE__ */ jsx(Form.ControlRow, {
						elementId: descriptionField.id,
						elementDescriptor: descriptors.apiKeysCreateFormDescriptionInput,
						children: /* @__PURE__ */ jsx(Form.PlainInput, { ...descriptionField.props })
					})
				}),
				/* @__PURE__ */ jsx(FormButtons, {
					submitLabel: localizationKeys("apiKeys.formButtonPrimary__add"),
					isDisabled: !canSubmit,
					onReset: closeCardFn,
					isLoading: card.isLoading,
					elementDescriptor: descriptors.apiKeysCreateFormSubmitButton
				})
			]
		})
	});
};

//#endregion
export { CreateAPIKeyForm };
//# sourceMappingURL=CreateAPIKeyForm.js.map