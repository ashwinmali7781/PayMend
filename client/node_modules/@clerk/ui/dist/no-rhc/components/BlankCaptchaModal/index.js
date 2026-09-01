import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Card } from "../../elements/Card/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/BlankCaptchaModal/index.tsx
const BlankCard = withCardStateProvider(() => {
	const { parsedCaptcha } = useAppearance();
	const { locale } = useLocalizations();
	const captchaTheme = parsedCaptcha?.theme;
	const captchaSize = parsedCaptcha?.size;
	const captchaLanguage = parsedCaptcha?.language || locale?.toLowerCase();
	return /* @__PURE__ */ jsx(Card.Root, { children: /* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsx("div", {
		id: "cl-modal-captcha-container",
		"data-cl-theme": captchaTheme,
		"data-cl-size": captchaSize,
		"data-cl-language": captchaLanguage
	}) }) });
});
function BlankCaptchaModal() {
	return /* @__PURE__ */ jsx(Route, {
		path: "blank-captcha",
		children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Flow.Root, {
			flow: "blankCaptcha",
			children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, {
				index: true,
				children: /* @__PURE__ */ jsx(BlankCard, {})
			}) })
		}) })
	});
}
BlankCaptchaModal.displayName = "BlankCaptchaModal";

//#endregion
export { BlankCaptchaModal };
//# sourceMappingURL=index.js.map