import { useRouter } from "../router/RouteContext.js";
import { Flow } from "../customizables/Flow.js";
import { useCardState, withCardStateProvider } from "../elements/contexts/index.js";
import { Card } from "../elements/Card/index.js";
import { handleError } from "../utils/errorHandler.js";
import { CaptchaElement } from "../elements/CaptchaElement.js";
import { LoadingCardContainer } from "../elements/LoadingCard.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/common/SSOCallback.tsx
const SSOCallback = withCardStateProvider((props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "ssoCallback",
		children: /* @__PURE__ */ jsx(SSOCallbackCard, { ...props })
	});
});
const SSOCallbackCard = (props) => {
	const { handleRedirectCallback, __internal_setActiveInProgress } = useClerk();
	const { navigate } = useRouter();
	const card = useCardState();
	const bounceTimeoutRef = React.useRef(void 0);
	React.useEffect(() => {
		let cancelled = false;
		if (__internal_setActiveInProgress !== true) {
			const intent = new URLSearchParams(window.location.search).get("intent");
			const reloadResource = intent === "signIn" || intent === "signUp" ? intent : void 0;
			handleRedirectCallback({
				...props,
				reloadResource
			}, navigate).catch((e) => {
				if (cancelled) return;
				bounceTimeoutRef.current = setTimeout(() => void navigate("../"), 4e3);
				try {
					handleError(e, [], card.setError);
				} catch {
					card.setError("Unable to complete action at this time. If the problem persists please contact support.");
				}
			});
		}
		return () => {
			cancelled = true;
			clearTimeout(bounceTimeoutRef.current);
		};
	}, [handleError, handleRedirectCallback]);
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "ssoCallback",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsx(LoadingCardContainer, {}),
			/* @__PURE__ */ jsx(CaptchaElement, {})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};

//#endregion
export { SSOCallback };
//# sourceMappingURL=SSOCallback.js.map