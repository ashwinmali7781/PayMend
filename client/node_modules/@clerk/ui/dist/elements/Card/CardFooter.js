import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { common } from "../../styledSystem/common.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flex, Link } from "../../customizables/index.js";
import { useDevMode } from "../../hooks/useDevMode.js";
import { Card } from "./index.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Card/CardFooter.tsx
const CardFooter = React.forwardRef((props, ref) => {
	const { children, isProfileFooter = false, sx, ...rest } = props;
	const { displayConfig } = useEnvironment();
	const { branded } = displayConfig;
	const { showDevModeNotice } = useDevMode();
	const { helpPageUrl, privacyPageUrl, termsPageUrl } = useAppearance().parsedOptions;
	const showSponsorAndLinks = isProfileFooter ? branded : !!(branded || helpPageUrl || privacyPageUrl || termsPageUrl);
	if (!children && !(showSponsorAndLinks || showDevModeNotice)) return null;
	const footerStyles = (t) => ({
		">:first-of-type": { padding: `${t.space.$4} ${t.space.$8} ${t.space.$4} ${t.space.$8}` },
		">:not(:first-of-type)": {
			padding: `${t.space.$4} ${t.space.$8}`,
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100
		}
	});
	const profileCardFooterStyles = (t) => ({ padding: `${t.space.$4} ${t.space.$8}` });
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		align: "center",
		justify: "center",
		elementDescriptor: descriptors.footer,
		sx: [
			(t) => ({
				marginTop: `calc(${t.space.$2} * -1)`,
				paddingTop: t.space.$2,
				background: common.mutedBackground(t),
				"&:empty": {
					padding: 0,
					marginTop: 0
				}
			}),
			!isProfileFooter && footerStyles,
			sx
		],
		...rest,
		ref,
		children: [children, /* @__PURE__ */ jsx(Card.ClerkAndPagesTag, {
			withFooterPages: showSponsorAndLinks && !isProfileFooter,
			devModeNoticeSx: (t) => ({
				padding: t.space.$none,
				marginBottom: `calc(${t.space.$1} * -1)`
			}),
			outerSx: isProfileFooter ? profileCardFooterStyles : void 0,
			withDevOverlay: true
		})]
	});
});
const CardFooterLink = (props) => {
	return /* @__PURE__ */ jsx(Link, {
		elementDescriptor: descriptors.footerPagesLink,
		...props,
		colorScheme: "neutral",
		variant: "buttonSmall"
	});
};
const CardFooterLinks = React.memo(() => {
	const { helpPageUrl, privacyPageUrl, termsPageUrl } = useAppearance().parsedOptions;
	if (!helpPageUrl && !privacyPageUrl && !termsPageUrl) return null;
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.footerPages,
		justify: "between",
		sx: (t) => ({
			gap: t.space.$3,
			[mqu.sm]: { gap: t.space.$2 }
		}),
		children: [
			helpPageUrl && /* @__PURE__ */ jsx(CardFooterLink, {
				localizationKey: localizationKeys("footerPageLink__help"),
				elementId: descriptors.footerPagesLink.setId("help"),
				isExternal: true,
				href: helpPageUrl
			}),
			privacyPageUrl && /* @__PURE__ */ jsx(CardFooterLink, {
				localizationKey: localizationKeys("footerPageLink__privacy"),
				elementId: descriptors.footerPagesLink.setId("privacy"),
				isExternal: true,
				href: privacyPageUrl
			}),
			termsPageUrl && /* @__PURE__ */ jsx(CardFooterLink, {
				localizationKey: localizationKeys("footerPageLink__terms"),
				elementId: descriptors.footerPagesLink.setId("terms"),
				isExternal: true,
				href: termsPageUrl
			})
		]
	});
});

//#endregion
export { CardFooter, CardFooterLinks };
//# sourceMappingURL=CardFooter.js.map