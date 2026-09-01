import { localizationKeys } from "../../localization/localizationKeys.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { Box, Text } from "../../customizables/index.js";
import { DevModeOverlay } from "../../elements/DevModeNotice.js";
import { LineItems } from "../../elements/LineItems.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/PaymentMethods/TestPaymentMethod.tsx
const TestPaymentMethod = () => {
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsxs(Box, {
		sx: (t) => ({
			background: t.colors.$neutralAlpha50,
			padding: t.space.$2x5,
			borderRadius: t.radii.$md,
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha100,
			display: "flex",
			flexDirection: "column",
			rowGap: t.space.$2,
			position: "relative",
			overflow: "hidden"
		}),
		children: [
			/* @__PURE__ */ jsx(DevModeOverlay, {}),
			/* @__PURE__ */ jsxs(Box, {
				sx: {
					display: "flex",
					alignItems: "baseline",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ jsx(Text, {
					variant: "caption",
					colorScheme: "body",
					localizationKey: localizationKeys("billing.paymentMethod.dev.testCardInfo")
				}), /* @__PURE__ */ jsx(Text, {
					variant: "caption",
					sx: (t) => ({
						color: t.colors.$warning500,
						fontWeight: t.fontWeights.$semibold
					}),
					localizationKey: localizationKeys("billing.paymentMethod.dev.developmentMode")
				})]
			}),
			/* @__PURE__ */ jsxs(LineItems.Root, { children: [
				/* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.paymentMethod.dev.cardNumber") }), /* @__PURE__ */ jsx(LineItems.Description, { text: "4242 4242 4242 4242" })]
				}),
				/* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.paymentMethod.dev.expirationDate") }), /* @__PURE__ */ jsx(LineItems.Description, { text: "11/44" })]
				}),
				/* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.paymentMethod.dev.cvcZip") }), /* @__PURE__ */ jsx(LineItems.Description, { text: t(localizationKeys("billing.paymentMethod.dev.anyNumbers")) })]
				})
			] })
		]
	});
};

//#endregion
export { TestPaymentMethod };
//# sourceMappingURL=TestPaymentMethod.js.map