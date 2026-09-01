import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSubscriberTypeContext, useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { resolveComputedCSSColor, resolveComputedCSSProperty } from "../../utils/cssVariables.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flex, Spinner } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { PaymentElementSkeleton } from "./PaymentElementSkeleton.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { __experimental_PaymentElement, __experimental_PaymentElementProvider, __experimental_usePaymentElement, createContextAndHook } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/PaymentMethods/AddPaymentMethod.tsx
const useStripeAppearance = (node) => {
	const theme = useAppearance().parsedInternalTheme;
	return useMemo(() => {
		if (!node) return;
		const { colors, fontWeights, fontSizes, radii, space } = theme;
		return {
			colorPrimary: resolveComputedCSSColor(node, colors.$primary500, colors.$colorBackground),
			colorBackground: resolveComputedCSSColor(node, colors.$colorInput, colors.$colorBackground),
			colorText: resolveComputedCSSColor(node, colors.$colorForeground, colors.$colorBackground),
			colorTextSecondary: resolveComputedCSSColor(node, colors.$colorMutedForeground, colors.$colorBackground),
			colorSuccess: resolveComputedCSSColor(node, colors.$success500, colors.$colorBackground),
			colorDanger: resolveComputedCSSColor(node, colors.$danger500, colors.$colorBackground),
			colorWarning: resolveComputedCSSColor(node, colors.$warning500, colors.$colorBackground),
			fontWeightNormal: resolveComputedCSSProperty(node, "font-weight", fontWeights.$normal.toString()),
			fontWeightMedium: resolveComputedCSSProperty(node, "font-weight", fontWeights.$medium.toString()),
			fontWeightBold: resolveComputedCSSProperty(node, "font-weight", fontWeights.$bold.toString()),
			fontSizeXl: resolveComputedCSSProperty(node, "font-size", fontSizes.$xl),
			fontSizeLg: resolveComputedCSSProperty(node, "font-size", fontSizes.$lg),
			fontSizeSm: resolveComputedCSSProperty(node, "font-size", fontSizes.$md),
			fontSizeXs: resolveComputedCSSProperty(node, "font-size", fontSizes.$sm),
			borderRadius: resolveComputedCSSProperty(node, "border-radius", radii.$lg),
			spacingUnit: resolveComputedCSSProperty(node, "padding", space.$1)
		};
	}, [theme, node]);
};
const [AddPaymentMethodContext, useAddPaymentMethodContext] = createContextAndHook("AddPaymentMethodRoot");
const AddPaymentMethodRoot = ({ children, checkout, ...rest }) => {
	const subscriberType = useSubscriberTypeContext();
	const stripeAppearanceNode = useRef(null);
	const { t } = useLocalizations();
	const [headerTitle, setHeaderTitle] = useState(void 0);
	const [headerSubtitle, setHeaderSubtitle] = useState(void 0);
	const [submitLabel, setSubmitLabel] = useState(void 0);
	const stripeAppearance = useStripeAppearance(stripeAppearanceNode.current);
	return /* @__PURE__ */ jsxs(AddPaymentMethodContext.Provider, {
		value: { value: {
			headerTitle,
			headerSubtitle,
			submitLabel,
			setHeaderTitle,
			setHeaderSubtitle,
			setSubmitLabel,
			checkout,
			...rest
		} },
		children: [/* @__PURE__ */ jsx("div", {
			ref: stripeAppearanceNode,
			style: { display: "none" }
		}), /* @__PURE__ */ jsx(__experimental_PaymentElementProvider, {
			checkout,
			for: subscriberType,
			stripeAppearance,
			paymentDescription: t(localizationKeys(checkout?.planPeriod === "month" ? "billing.paymentMethod.applePayDescription.monthly" : "billing.paymentMethod.applePayDescription.annual")),
			children
		})]
	});
};
const AddPaymentMethodLoading = (props) => {
	const { isProviderReady } = __experimental_usePaymentElement();
	if (!isProviderReady) return props.children;
	return null;
};
const AddPaymentMethodReady = (props) => {
	const { isProviderReady } = __experimental_usePaymentElement();
	if (!isProviderReady) return null;
	return /* @__PURE__ */ jsx(Fragment$1, { children: props.children });
};
const Root = (props) => {
	const { children, ...rest } = props;
	return /* @__PURE__ */ jsxs(AddPaymentMethodRoot, {
		...rest,
		children: [/* @__PURE__ */ jsx(AddPaymentMethodLoading, { children: /* @__PURE__ */ jsx(Flex, {
			direction: "row",
			align: "center",
			justify: "center",
			sx: (t) => ({
				width: "100%",
				minHeight: t.sizes.$60
			}),
			children: /* @__PURE__ */ jsx(Spinner, {
				size: "lg",
				colorScheme: "primary",
				elementDescriptor: descriptors.spinner
			})
		}) }), /* @__PURE__ */ jsx(AddPaymentMethodReady, { children: /* @__PURE__ */ jsx(AddPaymentMethodForm, { children }) })]
	});
};
const useSetAndSync = (text, setter) => {
	useRef(() => {
		setter(text);
	});
	useEffect(() => {
		setter(text);
	}, [text, setter]);
};
const FormHeader = ({ text }) => {
	const { setHeaderTitle } = useAddPaymentMethodContext();
	useSetAndSync(text, setHeaderTitle);
	return null;
};
const FormSubtitle = ({ text }) => {
	const { setHeaderSubtitle } = useAddPaymentMethodContext();
	useSetAndSync(text, setHeaderSubtitle);
	return null;
};
const FormButton = ({ text }) => {
	const { setSubmitLabel } = useAddPaymentMethodContext();
	useSetAndSync(text, setSubmitLabel);
	return null;
};
const AddPaymentMethodForm = ({ children }) => {
	const { headerTitle, headerSubtitle, submitLabel, checkout, onSuccess, cancelAction } = useAddPaymentMethodContext();
	const card = useCardState();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const { isFormReady, submit: submitPaymentElement, reset } = __experimental_usePaymentElement();
	const onSubmit = async (e) => {
		e.preventDefault();
		card.setLoading();
		card.setError(void 0);
		const { data, error } = await submitPaymentElement();
		if (error) {
			card.setIdle();
			if (error.error.type !== "validation_error") card.setError(error.error.message);
			return;
		}
		try {
			await onSuccess(data);
		} catch (error) {
			handleError(error, [], card.setError);
		} finally {
			card.setIdle();
			reset();
		}
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle,
		headerSubtitle,
		children: /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit,
			sx: (t) => ({
				display: "flex",
				flexDirection: "column",
				rowGap: t.space.$3
			}),
			children: [
				children,
				/* @__PURE__ */ jsx(__experimental_PaymentElement, { fallback: /* @__PURE__ */ jsx(PaymentElementSkeleton, {}) }),
				/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
				/* @__PURE__ */ jsx(FormButtons, {
					isDisabled: !isFormReady,
					submitLabel: submitLabel ?? localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.formButtonPrimary__add`),
					onReset: cancelAction,
					hideReset: !cancelAction,
					sx: { flex: checkout ? 1 : void 0 }
				})
			]
		})
	});
};

//#endregion
export { FormButton, FormHeader, FormSubtitle, Root };
//# sourceMappingURL=AddPaymentMethod.js.map