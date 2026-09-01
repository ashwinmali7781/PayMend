import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgArchive from "../../icons/archive.js";
import SvgCreditCard from "../../icons/credit-card.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Badge, Flex, Icon, Text } from "../../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/PaymentMethods/PaymentMethodRow.tsx
const PaymentMethodRow = ({ paymentMethod }) => {
	return /* @__PURE__ */ jsxs(Flex, {
		sx: { overflow: "hidden" },
		gap: 2,
		align: "baseline",
		elementDescriptor: descriptors.paymentMethodRow,
		children: [
			/* @__PURE__ */ jsx(Icon, {
				icon: paymentMethod.paymentType === "card" ? SvgCreditCard : SvgArchive,
				sx: (t) => ({
					alignSelf: "center",
					color: t.colors.$colorMutedForeground
				}),
				elementDescriptor: descriptors.paymentMethodRowIcon
			}),
			/* @__PURE__ */ jsx(Text, {
				sx: (t) => ({
					color: t.colors.$colorForeground,
					textTransform: "capitalize"
				}),
				truncate: true,
				elementDescriptor: descriptors.paymentMethodRowType,
				children: paymentMethod.paymentType === "card" ? paymentMethod.cardType : paymentMethod.paymentType
			}),
			/* @__PURE__ */ jsx(Text, {
				sx: (t) => ({ color: t.colors.$colorMutedForeground }),
				variant: "caption",
				truncate: true,
				elementDescriptor: descriptors.paymentMethodRowValue,
				children: paymentMethod.paymentType === "card" ? `⋯ ${paymentMethod.last4}` : null
			}),
			paymentMethod.isDefault && /* @__PURE__ */ jsx(Badge, {
				elementDescriptor: descriptors.paymentMethodRowBadge,
				elementId: descriptors.paymentMethodRowBadge.setId("default"),
				localizationKey: localizationKeys("badge__default")
			}),
			paymentMethod.status === "expired" && /* @__PURE__ */ jsx(Badge, {
				elementDescriptor: descriptors.paymentMethodRowBadge,
				elementId: descriptors.paymentMethodRowBadge.setId("expired"),
				colorScheme: "danger",
				localizationKey: localizationKeys("badge__expired")
			})
		]
	});
};

//#endregion
export { PaymentMethodRow };
//# sourceMappingURL=PaymentMethodRow.js.map