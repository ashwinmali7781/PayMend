import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCreateOrganizationContext } from "../../contexts/components/CreateOrganization.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Card } from "../../elements/Card/index.js";
import { CreateOrganizationForm } from "./CreateOrganizationForm.js";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/CreateOrganization/CreateOrganizationPage.tsx
const CreateOrganizationPage = withCardStateProvider(() => {
	const { closeCreateOrganization } = useClerk();
	const { mode, navigateAfterCreateOrganization, skipInvitationScreen } = useCreateOrganizationContext();
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Card.Root, {
		sx: (t) => ({ width: t.sizes.$108 }),
		children: [/* @__PURE__ */ jsxs(Card.Content, {
			sx: (t) => ({ padding: `${t.space.$4} ${t.space.$5}` }),
			children: [/* @__PURE__ */ jsx(Card.Alert, { children: card.error }), /* @__PURE__ */ jsx(CreateOrganizationForm, {
				skipInvitationScreen,
				startPage: { headerTitle: localizationKeys("createOrganization.title") },
				navigateAfterCreateOrganization,
				flow: "default",
				onComplete: () => {
					if (mode === "modal") closeCreateOrganization();
				}
			})]
		}), /* @__PURE__ */ jsx(Card.Footer, {})]
	});
});

//#endregion
export { CreateOrganizationPage };
//# sourceMappingURL=CreateOrganizationPage.js.map