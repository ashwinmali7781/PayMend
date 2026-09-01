import { localizationKeys } from "../../localization/localizationKeys.js";
import { ErrorCard } from "../../elements/ErrorCard.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/HavingTrouble.tsx
const HavingTrouble = (props) => {
	const { onBackLinkClick } = props;
	return /* @__PURE__ */ jsx(ErrorCard, {
		cardTitle: localizationKeys("reverification.alternativeMethods.getHelp.title"),
		cardSubtitle: localizationKeys("reverification.alternativeMethods.getHelp.content"),
		onBackLinkClick
	});
};

//#endregion
export { HavingTrouble };
//# sourceMappingURL=HavingTrouble.js.map