import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSubscriberTypeContext, useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { usePaymentMethods } from "../../contexts/components/Plans.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Box } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { RemoveResourceForm } from "../../common/RemoveResourceForm.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { ProfileSection } from "../../elements/Section.js";
import { DevOnly } from "../../common/DevOnly.js";
import { FormHeader, FormSubtitle, Root } from "./AddPaymentMethod.js";
import { PaymentMethodRow } from "./PaymentMethodRow.js";
import { FullHeightLoader } from "../../elements/FullHeightLoader.js";
import { TestPaymentMethod } from "./TestPaymentMethod.js";
import { Fragment, useMemo, useRef } from "react";
import { __internal_useOrganizationBase, useClerk } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/PaymentMethods/PaymentMethods.tsx
withCardStateProvider(({ onSuccess }) => {
	const { close } = useActionContext();
	const clerk = useClerk();
	const subscriberType = useSubscriberTypeContext();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const onAddPaymentMethodSuccess = async (context) => {
		await (subscriberType === "organization" ? clerk?.organization : clerk.user)?.addPaymentMethod(context);
		onSuccess();
		close();
		return Promise.resolve();
	};
	return /* @__PURE__ */ jsxs(Root, {
		onSuccess: onAddPaymentMethodSuccess,
		cancelAction: close,
		children: [
			/* @__PURE__ */ jsx(FormHeader, { text: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.add`) }),
			/* @__PURE__ */ jsx(FormSubtitle, { text: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.addSubtitle`) }),
			/* @__PURE__ */ jsx(DevOnly, { children: /* @__PURE__ */ jsx(TestPaymentMethod, {}) })
		]
	});
});
const RemoveScreen = ({ paymentMethod, revalidate }) => {
	const { close } = useActionContext();
	const card = useCardState();
	const subscriberType = useSubscriberTypeContext();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const ref = useRef(`${paymentMethod.paymentType === "card" ? paymentMethod.cardType : paymentMethod.paymentType} ${paymentMethod.paymentType === "card" ? `⋯ ${paymentMethod.last4}` : "-"}`);
	const organization = __internal_useOrganizationBase();
	if (!ref.current) return null;
	const removePaymentMethod = async () => {
		await paymentMethod.remove({ orgId: subscriberType === "organization" ? organization?.id : void 0 }).then(revalidate).catch((error) => {
			handleError(error, [], card.setError);
		});
	};
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.removeMethod.title`),
		messageLine1: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.removeMethod.messageLine1`, { identifier: ref.current }),
		messageLine2: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.removeMethod.messageLine2`),
		successMessage: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.removeMethod.successMessage`, { paymentMethod: ref.current }),
		deleteResource: removePaymentMethod,
		onSuccess: close,
		onReset: close
	});
};
const PaymentMethods = withCardStateProvider(() => {
	const clerk = useClerk();
	const subscriberType = useSubscriberTypeContext();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const resource = subscriberType === "organization" ? clerk?.organization : clerk.user;
	const { data: paymentMethods, isLoading, revalidate: revalidatePaymentMethods } = usePaymentMethods();
	const sortedPaymentMethods = useMemo(() => paymentMethods.sort((a, b) => a.isDefault && !b.isDefault ? -1 : 1), [paymentMethods]);
	if (!resource) return null;
	if (sortedPaymentMethods.length === 0) return null;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.title`),
		centered: false,
		id: "paymentMethods",
		sx: (t) => ({
			flex: 1,
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100
		}),
		children: /* @__PURE__ */ jsx(Action.Root, { children: /* @__PURE__ */ jsx(ProfileSection.ItemList, {
			id: "paymentMethods",
			disableAnimation: true,
			children: isLoading ? /* @__PURE__ */ jsx(Box, {
				sx: (t) => ({ height: t.space.$16 }),
				children: /* @__PURE__ */ jsx(FullHeightLoader, {})
			}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [sortedPaymentMethods.map((paymentMethod) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(ProfileSection.Item, {
				id: "paymentMethods",
				children: [/* @__PURE__ */ jsx(PaymentMethodRow, { paymentMethod }), /* @__PURE__ */ jsx(PaymentMethodMenu, {
					paymentMethod,
					revalidate: revalidatePaymentMethods
				})]
			}), /* @__PURE__ */ jsx(Action.Open, {
				value: `remove-${paymentMethod.id}`,
				children: /* @__PURE__ */ jsx(Action.Card, {
					variant: "destructive",
					children: /* @__PURE__ */ jsx(RemoveScreen, {
						paymentMethod,
						revalidate: revalidatePaymentMethods
					})
				})
			})] }, paymentMethod.id)), null] })
		}) })
	});
});
const PaymentMethodMenu = ({ paymentMethod, revalidate }) => {
	const { open } = useActionContext();
	const card = useCardState();
	const subscriberType = useSubscriberTypeContext();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const organization = __internal_useOrganizationBase();
	const actions = [{
		label: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.actionLabel__remove`),
		isDestructive: true,
		onClick: () => open(`remove-${paymentMethod.id}`),
		isDisabled: !paymentMethod.isRemovable
	}];
	if (!paymentMethod.isDefault) actions.unshift({
		label: localizationKeys(`${localizationRoot}.billingPage.paymentMethodsSection.actionLabel__default`),
		isDestructive: false,
		onClick: () => {
			paymentMethod.makeDefault({ orgId: subscriberType === "organization" ? organization?.id : void 0 }).then(revalidate).catch((error) => {
				handleError(error, [], card.setError);
			});
		},
		isDisabled: false
	});
	return /* @__PURE__ */ jsx(ThreeDotsMenu, { actions });
};

//#endregion
export { PaymentMethods };
//# sourceMappingURL=PaymentMethods.js.map