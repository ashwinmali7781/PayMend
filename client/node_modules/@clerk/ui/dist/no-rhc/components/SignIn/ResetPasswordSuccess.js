import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flex } from "../../primitives/Flex.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Col, Spinner, Text } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { useSetSessionWithTimeout } from "../../hooks/useSetSessionWithTimeout.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/ResetPasswordSuccess.tsx
const ResetPasswordSuccessInternal = () => {
	const card = useCardState();
	useSetSessionWithTimeout();
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsx(Header.Root, {
			showLogo: true,
			children: /* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.resetPassword.title") })
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsxs(Col, {
			elementDescriptor: descriptors.main,
			gap: 8,
			children: [/* @__PURE__ */ jsx(Text, { localizationKey: localizationKeys("signIn.resetPassword.successMessage") }), /* @__PURE__ */ jsx(Flex, {
				direction: "row",
				center: true,
				children: /* @__PURE__ */ jsx(Spinner, {
					size: "xl",
					colorScheme: "primary",
					elementDescriptor: descriptors.spinner
				})
			})]
		})
	] }), /* @__PURE__ */ jsx(Card.Footer, {})] });
};
const ResetPasswordSuccess = withCardStateProvider(ResetPasswordSuccessInternal);

//#endregion
export { ResetPasswordSuccess };
//# sourceMappingURL=ResetPasswordSuccess.js.map