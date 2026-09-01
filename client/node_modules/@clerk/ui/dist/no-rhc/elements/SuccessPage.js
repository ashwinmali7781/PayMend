import { useNavigateToFlowStart } from "../hooks/useNavigateToFlowStart.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Button, Col, Text } from "../customizables/index.js";
import { Header } from "./Header.js";
import { FormButtonContainer } from "./FormButtons.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/SuccessPage.tsx
const SuccessPage = (props) => {
	const { text, title, subtitle, finishLabel, onFinish, contents, finishButtonProps, headerBadgeText, ...rest } = props;
	const { navigateToFlowStart } = useNavigateToFlowStart();
	const { autoFocus: optionAutoFocus } = useAppearance().parsedOptions;
	return /* @__PURE__ */ jsxs(Col, {
		...rest,
		gap: 4,
		children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				badgeText: headerBadgeText,
				children: [title && /* @__PURE__ */ jsx(Header.Title, {
					localizationKey: title,
					textVariant: subtitle ? void 0 : "subtitle"
				}), subtitle && /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: subtitle })]
			}),
			/* @__PURE__ */ jsx(Col, {
				gap: 4,
				children: Array.isArray(text) ? text.map((t) => /* @__PURE__ */ jsx(Text, {
					localizationKey: t,
					colorScheme: "secondary",
					sx: (t) => ({
						display: "inline",
						":not(:last-of-type)": { marginInlineEnd: t.sizes.$1 }
					})
				}, t.key)) : /* @__PURE__ */ jsx(Text, {
					localizationKey: text,
					colorScheme: "secondary"
				})
			}),
			contents,
			/* @__PURE__ */ jsx(FormButtonContainer, { children: /* @__PURE__ */ jsx(Button, {
				autoFocus: optionAutoFocus,
				localizationKey: finishLabel || localizationKeys("userProfile.formButtonPrimary__finish"),
				elementDescriptor: descriptors.formButtonPrimary,
				onClick: onFinish || navigateToFlowStart,
				...finishButtonProps
			}) })
		]
	});
};

//#endregion
export { SuccessPage };
//# sourceMappingURL=SuccessPage.js.map