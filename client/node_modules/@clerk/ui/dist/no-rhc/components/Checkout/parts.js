import { useCheckoutContext } from "../../contexts/components/Checkout.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Flex } from "../../customizables/index.js";
import { Alert } from "../../elements/Alert.js";
import { Drawer, useDrawerContext } from "../../elements/Drawer.js";
import { LineItems } from "../../elements/LineItems.js";
import { EmailForm } from "../UserProfile/EmailForm.js";
import { __experimental_useCheckout } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Checkout/parts.tsx
const GenericError = () => {
	const { errors } = __experimental_useCheckout();
	const { translateError } = useLocalizations();
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsx(Drawer.Body, { children: /* @__PURE__ */ jsx(Flex, {
		align: "center",
		justify: "center",
		sx: (t) => ({
			height: "100%",
			padding: t.space.$4,
			fontSize: t.fontSizes.$md
		}),
		children: /* @__PURE__ */ jsx(Alert, {
			variant: "danger",
			colorScheme: "danger",
			children: errors.global ? translateError(errors.global[0]) : t(localizationKeys("unstable__errors.form_param_value_invalid"))
		})
	}) });
};
const InvalidPlanScreen = () => {
	const { planPeriod } = useCheckoutContext();
	const { errors } = __experimental_useCheckout();
	const InvalidPlanError = errors?.global?.filter((e) => e.isClerkAPIResponseError()).flatMap((e) => e.errors).find((e) => e.code === "invalid_plan_change");
	if (!InvalidPlanError) return null;
	const { plan: planFromError, isPlanUpgradePossible } = InvalidPlanError?.meta || {};
	return /* @__PURE__ */ jsx(Drawer.Body, { children: /* @__PURE__ */ jsxs(Flex, {
		gap: 4,
		direction: "col",
		children: [/* @__PURE__ */ jsx(Box, {
			elementDescriptor: descriptors.checkoutFormLineItemsRoot,
			sx: (t) => ({
				padding: t.space.$4,
				borderBottomWidth: t.borderWidths.$normal,
				borderBottomStyle: t.borderStyles.$solid,
				borderBottomColor: t.colors.$borderAlpha100
			}),
			children: /* @__PURE__ */ jsx(LineItems.Root, { children: /* @__PURE__ */ jsxs(LineItems.Group, { children: [/* @__PURE__ */ jsx(LineItems.Title, {
				title: planFromError.name,
				description: planPeriod === "annual" ? localizationKeys("billing.billedAnnually") : void 0
			}), /* @__PURE__ */ jsx(LineItems.Description, {
				prefix: planPeriod === "annual" ? "x12" : void 0,
				text: `${planFromError.currency_symbol}${planPeriod === "month" ? planFromError.amount_formatted : planFromError.annual_monthly_amount_formatted}`,
				suffix: localizationKeys("billing.checkout.perMonth")
			})] }) })
		}), /* @__PURE__ */ jsx(Box, {
			sx: (t) => ({ padding: t.space.$4 }),
			children: /* @__PURE__ */ jsx(Alert, {
				variant: "info",
				colorScheme: "info",
				title: isPlanUpgradePossible ? localizationKeys("billing.cannotSubscribeMonthly") : localizationKeys("billing.cannotSubscribeUnrecoverable")
			})
		})]
	}) });
};
const AddEmailForm = () => {
	const { checkout } = __experimental_useCheckout();
	const { setIsOpen } = useDrawerContext();
	return /* @__PURE__ */ jsx(Drawer.Body, { children: /* @__PURE__ */ jsx(Box, {
		sx: (t) => ({ padding: t.space.$4 }),
		children: /* @__PURE__ */ jsx(EmailForm, {
			title: localizationKeys("billing.checkout.emailForm.title"),
			subtitle: localizationKeys("billing.checkout.emailForm.subtitle"),
			onSuccess: () => void checkout.start(),
			onReset: () => setIsOpen(false),
			disableAutoFocus: true
		})
	}) });
};

//#endregion
export { AddEmailForm, GenericError, InvalidPlanScreen };
//# sourceMappingURL=parts.js.map