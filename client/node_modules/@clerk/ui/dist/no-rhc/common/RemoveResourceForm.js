import { localizationKeys } from "../localization/localizationKeys.js";
import { useCardState, withCardStateProvider } from "../elements/contexts/index.js";
import { Text } from "../customizables/index.js";
import { handleError } from "../utils/errorHandler.js";
import { Form } from "../elements/Form.js";
import { FormButtons } from "../elements/FormButtons.js";
import { FormContainer } from "../elements/FormContainer.js";
import { useReverification } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/common/RemoveResourceForm.tsx
const RemoveResourceForm = withCardStateProvider((props) => {
	const { title, messageLine1, messageLine2, deleteResource, onSuccess, onReset } = props;
	const card = useCardState();
	const deleteWithReverification = useReverification(deleteResource);
	const handleSubmit = async () => {
		try {
			await deleteWithReverification().then(onSuccess);
		} catch (e) {
			handleError(e, [], card.setError);
		}
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: title,
		headerSubtitle: messageLine1,
		children: /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit: handleSubmit,
			children: [messageLine2 ? /* @__PURE__ */ jsx(Text, {
				colorScheme: "secondary",
				localizationKey: messageLine2
			}) : null, /* @__PURE__ */ jsx(FormButtons, {
				submitLabel: localizationKeys("userProfile.formButtonPrimary__remove"),
				colorScheme: "danger",
				onReset
			})]
		})
	});
});

//#endregion
export { RemoveResourceForm };
//# sourceMappingURL=RemoveResourceForm.js.map