import { useCheckoutContext } from "../../contexts/components/Checkout.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgChevronUpDown from "../../icons/chevron-up-down.js";
import SvgClose from "../../icons/close.js";
import SvgInformationCircle from "../../icons/information-circle.js";
import { getCheckoutSeatUnitTotal, getIncludedSeatsUnitTotalTier, getPaidSeatsUnitTotalTier, getSeatUnitPrice } from "../../utils/billingPlanSeats.js";
import { usePaymentMethods } from "../../contexts/components/Plans.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Box, Button, Col, Flex, Form, Icon, Input, Spinner, Text } from "../../customizables/index.js";
import { DevModeOverlay } from "../../elements/DevModeNotice.js";
import { Card } from "../../elements/Card/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Select, SelectButton, SelectOptionList } from "../../elements/Select.js";
import { Drawer } from "../../elements/Drawer.js";
import { LineItems } from "../../elements/LineItems.js";
import { Tooltip } from "../../elements/Tooltip.js";
import { getDiscountDescription, toNegativeAmount } from "../../utils/billing.js";
import { DevOnly } from "../../common/DevOnly.js";
import { FormButton, Root } from "../PaymentMethods/AddPaymentMethod.js";
import { PaymentMethodRow } from "../PaymentMethods/PaymentMethodRow.js";
import { SubscriptionBadge } from "../Subscriptions/badge.js";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { useMemo, useState } from "react";
import { __experimental_useCheckout } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Checkout/CheckoutForm.tsx
const capitalize = (name) => name[0].toUpperCase() + name.slice(1);
const HIDDEN_INPUT_NAME = "payment_method_id";
const promoCodeErrorMessage = (error) => {
	if (isClerkAPIResponseError(error)) return error.errors[0]?.longMessage || error.errors[0]?.message;
	return error instanceof Error ? error.message : void 0;
};
const useUpdatePromoCode = () => {
	const { checkout } = __experimental_useCheckout();
	const { t } = useLocalizations();
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const updatePromoCode = async (value) => {
		setError(void 0);
		setIsLoading(true);
		const result = await checkout.update({ promoCode: value });
		setIsLoading(false);
		if (result.error) {
			setError(promoCodeErrorMessage(result.error) || t(localizationKeys("unstable__errors.form_param_value_invalid")));
			return false;
		}
		return true;
	};
	return {
		error,
		isLoading,
		setError,
		updatePromoCode
	};
};
const AppliedPromoCodeRow = () => {
	const { checkout } = __experimental_useCheckout();
	const { $, t } = useLocalizations();
	const { isLoading, updatePromoCode } = useUpdatePromoCode();
	const discount = checkout.status === "needs_confirmation" ? checkout.totals.discounts?.discount : void 0;
	const appliedPromoCode = discount?.promoCode;
	if (!discount || !appliedPromoCode) return null;
	return /* @__PURE__ */ jsxs(LineItems.Group, {
		variant: "primary",
		borderTop: true,
		children: [/* @__PURE__ */ jsx(LineItems.Title, {
			title: appliedPromoCode,
			description: checkout.planPeriod ? getDiscountDescription(discount, discount.cyclesRemaining, checkout.planPeriod, {
				$,
				t
			}) : void 0,
			badge: /* @__PURE__ */ jsx(Button, {
				elementDescriptor: descriptors.checkoutFormPromoCodeRemoveButton,
				type: "button",
				variant: "ghost",
				colorScheme: "neutral",
				"aria-label": t(localizationKeys("billing.checkout.removePromoCode")),
				isDisabled: isLoading,
				onClick: () => void updatePromoCode(""),
				sx: {
					padding: 0,
					position: "relative",
					"&::after": {
						content: "\"\"",
						position: "absolute",
						inset: "-18px"
					}
				},
				children: /* @__PURE__ */ jsx(Icon, {
					icon: SvgClose,
					size: "xs"
				})
			})
		}), /* @__PURE__ */ jsx(LineItems.Description, {
			text: $(toNegativeAmount(discount.amount)),
			descriptionInnerAlignment: "start"
		})]
	});
};
const PromoCodeInput = () => {
	const { checkout } = __experimental_useCheckout();
	const { t } = useLocalizations();
	const [promoCode, setPromoCode] = useState("");
	const { error, isLoading, setError, updatePromoCode } = useUpdatePromoCode();
	if (checkout.status !== "needs_confirmation" || checkout.totals.discounts?.discount) return null;
	const errorId = "checkout-promo-code-error";
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.checkoutFormPromoCodeRoot,
		sx: (theme) => ({
			padding: theme.space.$4,
			borderBottomWidth: theme.borderWidths.$normal,
			borderBottomStyle: theme.borderStyles.$solid,
			borderBottomColor: theme.colors.$borderAlpha100
		}),
		children: /* @__PURE__ */ jsxs(Box, {
			as: "form",
			onSubmit: (event) => {
				event.preventDefault();
				updatePromoCode(promoCode.trim()).then((success) => {
					if (success) setPromoCode("");
				});
			},
			sx: (theme) => ({
				display: "grid",
				gridTemplateColumns: "minmax(0, 1fr) auto",
				gap: theme.space.$2
			}),
			children: [
				/* @__PURE__ */ jsx(Input, {
					elementDescriptor: descriptors.checkoutFormPromoCodeInput,
					"aria-label": t(localizationKeys("billing.checkout.promoCodePlaceholder")),
					"aria-describedby": error ? errorId : void 0,
					hasError: Boolean(error),
					isDisabled: isLoading,
					placeholder: t(localizationKeys("billing.checkout.promoCodePlaceholder")),
					value: promoCode,
					onChange: (event) => {
						setPromoCode(event.target.value);
						setError(void 0);
					}
				}),
				/* @__PURE__ */ jsx(Button, {
					elementDescriptor: descriptors.checkoutFormPromoCodeApplyButton,
					type: "submit",
					variant: "bordered",
					colorScheme: "secondary",
					isDisabled: !promoCode.trim(),
					isLoading,
					localizationKey: localizationKeys("billing.checkout.applyPromoCode")
				}),
				error ? /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.checkoutFormPromoCodeErrorText,
					id: errorId,
					role: "alert",
					variant: "caption",
					colorScheme: "danger",
					sx: { gridColumn: "1 / -1" },
					children: error
				}) : null
			]
		})
	});
};
const CheckoutForm = withCardStateProvider(() => {
	const { checkout } = __experimental_useCheckout();
	const { $ } = useLocalizations();
	const { plan, totals, isImmediatePlanChange, planPeriod, freeTrialEndsAt } = checkout;
	if (!plan) return null;
	const showProratedCredit = !!totals.credits?.proration?.amount && totals.credits.proration.amount.amount > 0;
	const showAccountCredits = !!totals.credits?.payer?.appliedAmount && totals.credits.payer.appliedAmount.amount > 0;
	const showPastDue = !!totals.pastDue?.amount && totals.pastDue.amount > 0;
	const showProratedDiscount = !!totals.discounts?.proration?.amount && totals.discounts.proration.amount.amount > 0;
	const showRenewalTotals = !!totals.totalsDuePerPeriod && totals.totalDueNow && totals.totalsDuePerPeriod.grandTotal.amount !== totals.totalDueNow.amount;
	const showDowngradeInfo = !isImmediatePlanChange;
	const seatPerUnitTotal = getCheckoutSeatUnitTotal(totals);
	const includedSeatsTier = getIncludedSeatsUnitTotalTier(seatPerUnitTotal);
	const paidSeatsTier = getPaidSeatsUnitTotalTier(seatPerUnitTotal);
	const descriptionElements = [];
	if (planPeriod === "annual") descriptionElements.push(localizationKeys("billing.billedAnnually"));
	if (includedSeatsTier && includedSeatsTier.quantity !== null) descriptionElements.push(localizationKeys("billing.pricingTable.seatCost.includedSeats", { includedSeats: includedSeatsTier.quantity }));
	const seatUnitPrice = getSeatUnitPrice(plan);
	if (seatUnitPrice && seatUnitPrice.tiers.length === 1 && seatUnitPrice.tiers[0].feePerBlock.amount === 0) descriptionElements.push(seatUnitPrice.tiers[0].endsAfterBlock ? localizationKeys("billing.pricingTable.seatCost.upToSeats", { endsAfterBlock: seatUnitPrice.tiers[0].endsAfterBlock }) : localizationKeys("billing.pricingTable.seatCost.unlimitedSeats"));
	return /* @__PURE__ */ jsxs(Drawer.Body, { children: [
		/* @__PURE__ */ jsx(Box, {
			elementDescriptor: descriptors.checkoutFormLineItemsRoot,
			sx: (t) => ({
				padding: t.space.$4,
				borderBottomWidth: t.borderWidths.$normal,
				borderBottomStyle: t.borderStyles.$solid,
				borderBottomColor: t.colors.$borderAlpha100
			}),
			children: /* @__PURE__ */ jsxs(LineItems.Root, { children: [
				/* @__PURE__ */ jsxs(LineItems.Group, { children: [/* @__PURE__ */ jsx(LineItems.Title, {
					title: plan.name,
					description: descriptionElements,
					badge: plan.freeTrialEnabled && freeTrialEndsAt ? /* @__PURE__ */ jsx(SubscriptionBadge, { subscription: { status: "free_trial" } }) : null
				}), totals.baseFee ? /* @__PURE__ */ jsx(LineItems.Description, {
					prefix: planPeriod === "annual" ? "x12" : void 0,
					text: $(totals.baseFee),
					suffix: localizationKeys("billing.checkout.perMonth")
				}) : null] }),
				paidSeatsTier && paidSeatsTier.quantity !== null && /* @__PURE__ */ jsxs(LineItems.Group, {
					borderTop: true,
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.seats") }), /* @__PURE__ */ jsx(LineItems.Description, {
						prefix: `${paidSeatsTier.quantity} x`,
						text: $(paidSeatsTier.feePerBlock),
						suffix: localizationKeys("billing.checkout.perMonth")
					})]
				}),
				showProratedDiscount && /* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.proratedDiscount") }), /* @__PURE__ */ jsx(LineItems.Description, { text: totals.discounts?.proration?.amount ? $(toNegativeAmount(totals.discounts.proration.amount)) : "" })]
				}),
				showProratedCredit && /* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.creditRemainder") }), /* @__PURE__ */ jsx(LineItems.Description, { text: totals.credits?.proration?.amount ? $(toNegativeAmount(totals.credits.proration.amount)) : "" })]
				}),
				showAccountCredits && /* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.payerCreditRemainder") }), /* @__PURE__ */ jsx(LineItems.Description, { text: totals.credits?.payer?.appliedAmount ? $(toNegativeAmount(totals.credits.payer.appliedAmount)) : "" })]
				}),
				showPastDue && /* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsxs(Tooltip.Root, { children: [/* @__PURE__ */ jsx(Tooltip.Trigger, { children: /* @__PURE__ */ jsx(LineItems.Title, {
						title: localizationKeys("billing.pastDue"),
						icon: SvgInformationCircle
					}) }), /* @__PURE__ */ jsx(Tooltip.Content, { text: localizationKeys("billing.checkout.pastDueNotice") })] }), /* @__PURE__ */ jsx(LineItems.Description, { text: totals.pastDue ? $(totals.pastDue) : "" })]
				}),
				/* @__PURE__ */ jsx(AppliedPromoCodeRow, {}),
				!!freeTrialEndsAt && !!plan.freeTrialDays && totals.totalDueAfterFreeTrial ? /* @__PURE__ */ jsxs(LineItems.Group, {
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.checkout.totalDueAfterTrial", { days: plan.freeTrialDays }) }), /* @__PURE__ */ jsx(LineItems.Description, { text: $(totals.totalDueAfterFreeTrial) })]
				}) : showRenewalTotals ? null : totals.totalDuePerPeriod ? /* @__PURE__ */ jsxs(LineItems.Group, {
					borderTop: true,
					variant: "tertiary",
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.checkout.totalDuePerPeriod") }), /* @__PURE__ */ jsx(LineItems.Description, { text: $(totals.totalDuePerPeriod) })]
				}) : null,
				totals.totalDueNow ? /* @__PURE__ */ jsxs(LineItems.Group, {
					borderTop: true,
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.totalDueToday") }), /* @__PURE__ */ jsx(LineItems.Description, { text: $(totals.totalDueNow) })]
				}) : null,
				showRenewalTotals && /* @__PURE__ */ jsxs(LineItems.Group, {
					borderTop: true,
					children: [/* @__PURE__ */ jsx(LineItems.Title, { title: localizationKeys("billing.totalDuePerPeriod") }), /* @__PURE__ */ jsx(LineItems.Description, { text: totals.totalsDuePerPeriod ? $(totals.totalsDuePerPeriod.grandTotal) : "" })]
				})
			] })
		}),
		/* @__PURE__ */ jsx(PromoCodeInput, {}),
		showDowngradeInfo && /* @__PURE__ */ jsx(Box, {
			elementDescriptor: descriptors.checkoutFormLineItemsRoot,
			sx: (t) => ({
				paddingBlockStart: t.space.$4,
				paddingInline: t.space.$4
			}),
			children: /* @__PURE__ */ jsx(Text, {
				localizationKey: localizationKeys("billing.checkout.downgradeNotice"),
				variant: "caption",
				colorScheme: "secondary"
			})
		}),
		/* @__PURE__ */ jsx(CheckoutFormElements, {})
	] });
});
const useCheckoutMutations = () => {
	const { onSubscriptionComplete } = useCheckoutContext();
	const { checkout } = __experimental_useCheckout();
	const card = useCardState();
	if (checkout.status !== "needs_confirmation") throw new Error("Checkout not found");
	const confirmCheckout = async (params) => {
		card.setLoading();
		card.setError(void 0);
		const { error } = await checkout.confirm(params);
		if (error) handleError(error, [], card.setError);
		else onSubscriptionComplete?.();
		card.setIdle();
	};
	const payWithExistingPaymentMethod = (e) => {
		e.preventDefault();
		return confirmCheckout({ paymentMethodId: new FormData(e.currentTarget).get(HIDDEN_INPUT_NAME) });
	};
	const payWithoutPaymentMethod = (e) => {
		e.preventDefault();
		return confirmCheckout({});
	};
	const addPaymentMethodAndPay = (ctx) => confirmCheckout(ctx);
	const payWithTestCard = () => confirmCheckout({
		gateway: "stripe",
		useTestCard: true
	});
	return {
		payWithExistingPaymentMethod,
		addPaymentMethodAndPay,
		payWithTestCard,
		payWithoutPaymentMethod
	};
};
const CheckoutFormElements = () => {
	const { checkout } = __experimental_useCheckout();
	const { plan } = checkout;
	const { isLoading } = usePaymentMethods();
	if (!plan) return null;
	if (isLoading) return /* @__PURE__ */ jsx(Spinner, { sx: { margin: "auto" } });
	return /* @__PURE__ */ jsx(CheckoutFormElementsInternal, {});
};
const CheckoutFormElementsInternal = () => {
	const { checkout } = __experimental_useCheckout();
	const { plan, isImmediatePlanChange, needsPaymentMethod } = checkout;
	const { data: paymentMethods } = usePaymentMethods();
	const [paymentMethodSource, setPaymentMethodSource] = useState(() => (paymentMethods.length, "existing"));
	if (!plan) return null;
	return /* @__PURE__ */ jsxs(Col, {
		elementDescriptor: descriptors.checkoutFormElementsRoot,
		gap: 4,
		sx: (t) => ({ padding: t.space.$4 }),
		children: [null, !needsPaymentMethod ? /* @__PURE__ */ jsx(FreeTrialButton, {}) : paymentMethodSource === "existing" ? /* @__PURE__ */ jsx(ExistingPaymentMethodForm, { paymentMethods }) : false]
	});
};
const PayWithTestPaymentMethod = () => {
	const { isLoading } = useCardState();
	const { payWithTestCard } = useCheckoutMutations();
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
		children: [/* @__PURE__ */ jsx(DevModeOverlay, {}), /* @__PURE__ */ jsxs(Flex, {
			sx: (t) => ({
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				rowGap: t.space.$2
			}),
			children: [/* @__PURE__ */ jsx(Text, {
				sx: (t) => ({
					color: t.colors.$warning500,
					fontWeight: t.fontWeights.$semibold
				}),
				localizationKey: localizationKeys("billing.paymentMethod.dev.developmentMode")
			}), /* @__PURE__ */ jsx(Button, {
				type: "button",
				block: true,
				variant: "bordered",
				localizationKey: localizationKeys("userProfile.billingPage.paymentMethodsSection.payWithTestCardButton"),
				colorScheme: "secondary",
				isLoading,
				onClick: payWithTestCard
			})]
		})]
	});
};
const useSubmitLabel = () => {
	const { checkout } = __experimental_useCheckout();
	const { seatsQuantity } = useCheckoutContext();
	const { $ } = useLocalizations();
	const { status, freeTrialEndsAt, totals } = checkout;
	if (status === "needs_initialization") throw new Error("Clerk: Invalid state");
	if (freeTrialEndsAt) {
		if (seatsQuantity && totals.totalDueNow) return localizationKeys("billing.pay", { amount: $(totals.totalDueNow) });
		return localizationKeys("billing.startFreeTrial");
	}
	if (totals.totalDueNow && totals.totalDueNow.amount > 0) return localizationKeys("billing.pay", { amount: $(totals.totalDueNow) });
	return localizationKeys("billing.subscribe");
};
const FreeTrialButton = withCardStateProvider(() => {
	const { for: _for } = useCheckoutContext();
	const { payWithoutPaymentMethod } = useCheckoutMutations();
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Form, {
		onSubmit: payWithoutPaymentMethod,
		sx: formProps,
		children: [/* @__PURE__ */ jsx(Card.Alert, { children: card.error }), /* @__PURE__ */ jsx(CheckoutSubmitButton, {})]
	});
});
withCardStateProvider(() => {
	const { addPaymentMethodAndPay } = useCheckoutMutations();
	const submitLabel = useSubmitLabel();
	const { checkout } = __experimental_useCheckout();
	return /* @__PURE__ */ jsxs(Root, {
		onSuccess: addPaymentMethodAndPay,
		checkout,
		children: [/* @__PURE__ */ jsx(DevOnly, { children: /* @__PURE__ */ jsx(PayWithTestPaymentMethod, {}) }), /* @__PURE__ */ jsx(FormButton, { text: submitLabel })]
	});
});
const CheckoutSubmitButton = (props) => {
	const card = useCardState();
	const submitLabel = useSubmitLabel();
	return /* @__PURE__ */ jsx(Button, {
		type: "submit",
		colorScheme: "primary",
		size: "sm",
		textVariant: "buttonLarge",
		sx: { width: "100%" },
		isLoading: card.isLoading,
		localizationKey: submitLabel,
		...props
	});
};
const formProps = (t) => ({
	display: "flex",
	flexDirection: "column",
	rowGap: t.space.$4
});
const ExistingPaymentMethodForm = withCardStateProvider(({ paymentMethods }) => {
	const { checkout } = __experimental_useCheckout();
	const { paymentMethod, isImmediatePlanChange, needsPaymentMethod } = checkout;
	const { payWithExistingPaymentMethod } = useCheckoutMutations();
	const card = useCardState();
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod || paymentMethods.find((p) => p.isDefault));
	const options = useMemo(() => {
		return paymentMethods.map((method) => {
			const label = method.paymentType !== "card" ? method.paymentType ? `${capitalize(method.paymentType)}` : "–" : method.cardType ? `${capitalize(method.cardType)} ⋯ ${method.last4}` : "–";
			return {
				value: method.id,
				label
			};
		});
	}, [paymentMethods]);
	return /* @__PURE__ */ jsxs(Form, {
		onSubmit: payWithExistingPaymentMethod,
		sx: formProps,
		children: [
			isImmediatePlanChange && needsPaymentMethod ? /* @__PURE__ */ jsxs(Select, {
				elementId: "paymentMethod",
				options,
				value: selectedPaymentMethod?.id || null,
				onChange: (option) => {
					setSelectedPaymentMethod(paymentMethods.find((source) => source.id === option.value));
				},
				portal: true,
				children: [
					/* @__PURE__ */ jsx("input", {
						name: HIDDEN_INPUT_NAME,
						type: "hidden",
						value: selectedPaymentMethod?.id
					}),
					/* @__PURE__ */ jsx(SelectButton, {
						icon: SvgChevronUpDown,
						sx: (t) => ({
							justifyContent: "space-between",
							backgroundColor: t.colors.$colorBackground
						}),
						children: selectedPaymentMethod && /* @__PURE__ */ jsx(PaymentMethodRow, { paymentMethod: selectedPaymentMethod })
					}),
					/* @__PURE__ */ jsx(SelectOptionList, { sx: (t) => ({
						paddingBlock: t.space.$1,
						color: t.colors.$colorForeground
					}) })
				]
			}) : /* @__PURE__ */ jsx("input", {
				name: HIDDEN_INPUT_NAME,
				type: "hidden",
				value: selectedPaymentMethod?.id
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsx(CheckoutSubmitButton, {})
		]
	});
});

//#endregion
export { CheckoutForm };
//# sourceMappingURL=CheckoutForm.js.map