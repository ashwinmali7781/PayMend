import { CheckoutContext } from "../../contexts/components/Checkout.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { Flow } from "../../customizables/Flow.js";
import { Spinner } from "../../customizables/index.js";
import { Drawer } from "../../elements/Drawer.js";
import { CheckoutComplete } from "./CheckoutComplete.js";
import { CheckoutForm } from "./CheckoutForm.js";
import { FetchStatus, Root, Stage } from "./CheckoutPage.js";
import { AddEmailForm, GenericError, InvalidPlanScreen } from "./parts.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Checkout/index.tsx
const Checkout = (props) => {
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "checkout",
		children: /* @__PURE__ */ jsx(Flow.Part, { children: /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
			value: props.for || "user",
			children: /* @__PURE__ */ jsx(CheckoutContext.Provider, {
				value: {
					componentName: "Checkout",
					...props
				},
				children: /* @__PURE__ */ jsxs(Drawer.Content, { children: [/* @__PURE__ */ jsx(Drawer.Header, { title: localizationKeys("billing.checkout.title") }), /* @__PURE__ */ jsxs(Root, { children: [
					/* @__PURE__ */ jsxs(Stage, {
						name: "needs_initialization",
						children: [
							/* @__PURE__ */ jsx(FetchStatus, {
								status: "fetching",
								children: /* @__PURE__ */ jsx(Spinner, { sx: { margin: "auto" } })
							}),
							/* @__PURE__ */ jsx(FetchStatus, {
								status: "invalid_plan_change",
								children: /* @__PURE__ */ jsx(InvalidPlanScreen, {})
							}),
							/* @__PURE__ */ jsx(FetchStatus, {
								status: "missing_payer_email",
								children: /* @__PURE__ */ jsx(AddEmailForm, {})
							}),
							/* @__PURE__ */ jsx(FetchStatus, {
								status: "generic_error",
								children: /* @__PURE__ */ jsx(GenericError, {})
							})
						]
					}),
					/* @__PURE__ */ jsx(Stage, {
						name: "completed",
						children: /* @__PURE__ */ jsx(CheckoutComplete, {})
					}),
					/* @__PURE__ */ jsx(Stage, {
						name: "needs_confirmation",
						children: /* @__PURE__ */ jsx(CheckoutForm, {})
					})
				] })] })
			})
		}) })
	});
};

//#endregion
export { Checkout };
//# sourceMappingURL=index.js.map