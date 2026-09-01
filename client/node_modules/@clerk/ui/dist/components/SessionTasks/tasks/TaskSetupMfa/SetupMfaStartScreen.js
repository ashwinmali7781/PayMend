import SvgAuthApp from "../../../../icons/auth-app.js";
import SvgMobile from "../../../../icons/mobile.js";
import { localizationKeys } from "../../../../localization/localizationKeys.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { Flex, Icon, Text } from "../../../../customizables/index.js";
import { useCardState, withCardStateProvider } from "../../../../elements/contexts/index.js";
import { Card } from "../../../../elements/Card/index.js";
import { Header } from "../../../../elements/Header.js";
import { Actions } from "../../../../elements/Actions.js";
import { PreviewButton } from "../../../../elements/PreviewButton.js";
import { MFA_METHODS_TO_STEP } from "./constants.js";
import { SharedFooterActionForSignOut } from "./shared.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskSetupMfa/SetupMfaStartScreen.tsx
const METHOD_CONFIG = {
	totp: {
		icon: /* @__PURE__ */ jsx(Icon, { icon: SvgAuthApp }),
		label: localizationKeys("taskSetupMfa.start.methodSelection.totp")
	},
	phone_code: {
		icon: /* @__PURE__ */ jsx(Icon, { icon: SvgMobile }),
		label: localizationKeys("taskSetupMfa.start.methodSelection.phoneCode")
	}
};
const SetupMfaStartScreen = withCardStateProvider((props) => {
	const { availableMethods, goToStep } = props;
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, {
		sx: (t) => ({ padding: t.space.$none }),
		children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				sx: (t) => ({
					paddingTop: t.space.$8,
					paddingInline: t.space.$8
				}),
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("taskSetupMfa.start.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("taskSetupMfa.start.subtitle") })]
			}),
			card.error && /* @__PURE__ */ jsx(Flex, {
				sx: (t) => ({ paddingInline: t.space.$8 }),
				children: /* @__PURE__ */ jsx(Card.Alert, { children: card.error })
			}),
			/* @__PURE__ */ jsx(Actions, {
				elementDescriptor: descriptors.taskSetupMfaMethodSelectionItems,
				sx: (t) => ({
					borderTopWidth: t.borderWidths.$normal,
					borderTopStyle: t.borderStyles.$solid,
					borderTopColor: t.colors.$borderAlpha100
				}),
				children: availableMethods.map((method) => {
					const methodConfig = METHOD_CONFIG[method] ?? null;
					if (!methodConfig) return null;
					return /* @__PURE__ */ jsx(PreviewButton, {
						elementDescriptor: descriptors.taskSetupMfaMethodSelectionItem,
						hoverAsFocus: true,
						block: true,
						onClick: () => {
							goToStep(MFA_METHODS_TO_STEP[method]);
						},
						children: /* @__PURE__ */ jsxs(Flex, {
							sx: (t) => ({
								gap: t.space.$2,
								alignItems: "center"
							}),
							children: [/* @__PURE__ */ jsx(Flex, {
								sx: (t) => ({
									borderRadius: t.radii.$circle,
									borderWidth: t.borderWidths.$normal,
									borderStyle: t.borderStyles.$solid,
									borderColor: t.colors.$avatarBorder,
									padding: t.space.$2,
									backgroundColor: t.colors.$neutralAlpha50
								}),
								children: methodConfig.icon
							}), /* @__PURE__ */ jsx(Text, {
								variant: "buttonLarge",
								localizationKey: methodConfig.label
							})]
						})
					}, method);
				})
			})
		]
	}), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsx(SharedFooterActionForSignOut, {}) })] });
});

//#endregion
export { SetupMfaStartScreen };
//# sourceMappingURL=SetupMfaStartScreen.js.map