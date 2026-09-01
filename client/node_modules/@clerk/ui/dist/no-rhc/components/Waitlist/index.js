import { localizationKeys } from "../../localization/localizationKeys.js";
import { Route } from "../../router/Route.js";
import { VIRTUAL_ROUTER_BASE_PATH } from "../../router/VirtualRouter.js";
import { WaitlistContext, useWaitlistContext } from "../../contexts/components/Waitlist.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Card } from "../../elements/Card/index.js";
import { WaitlistForm } from "./WaitlistForm.js";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Waitlist/index.tsx
const _Waitlist = () => {
	const clerk = useClerk();
	const ctx = useWaitlistContext();
	const { signInUrl } = ctx;
	const formState = { emailAddress: useFormControl("emailAddress", (ctx.initialValues || {}).emailAddress || "", {
		type: "email",
		label: localizationKeys("formFieldLabel__emailAddress"),
		placeholder: localizationKeys("formFieldInputPlaceholder__emailAddress")
	}) };
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "waitlist",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsx(WaitlistForm, { formState }) }), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsxs(Card.Action, {
			elementId: "waitlist",
			children: [/* @__PURE__ */ jsx(Card.ActionText, { localizationKey: localizationKeys("waitlist.start.actionText") }), /* @__PURE__ */ jsx(Card.ActionLink, {
				localizationKey: localizationKeys("waitlist.start.actionLink"),
				to: clerk.buildUrlWithAuth(signInUrl)
			})]
		}) })] })
	});
};
const Waitlist = withCardStateProvider(_Waitlist);
const WaitlistModal = (props) => {
	const waitlistProps = {
		signInUrl: `/${VIRTUAL_ROUTER_BASE_PATH}/sign-in`,
		...props,
		routing: "virtual"
	};
	return /* @__PURE__ */ jsx(Route, {
		path: "waitlist",
		children: /* @__PURE__ */ jsx(WaitlistContext.Provider, {
			value: {
				...waitlistProps,
				componentName: "Waitlist",
				mode: "modal"
			},
			children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Waitlist, {}) })
		})
	});
};

//#endregion
export { Waitlist, WaitlistModal };
//# sourceMappingURL=index.js.map