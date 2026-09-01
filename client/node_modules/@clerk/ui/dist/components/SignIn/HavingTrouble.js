import { localizationKeys } from "../../localization/localizationKeys.js";
import { ErrorCard } from "../../elements/ErrorCard.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/HavingTrouble.tsx
const HavingTrouble = (props) => {
	const { onBackLinkClick } = props;
	return /* @__PURE__ */ jsx(ErrorCard, {
		cardTitle: localizationKeys("signIn.alternativeMethods.getHelp.title"),
		cardSubtitle: localizationKeys("signIn.alternativeMethods.getHelp.content"),
		onBackLinkClick
	});
};

//#endregion
export { HavingTrouble };
//# sourceMappingURL=HavingTrouble.js.map