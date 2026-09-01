import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col } from "../../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/ProfileCard/ProfileCardPage.tsx
/**
* Per-page padding wrapper rendered inside `ProfileCardContent`
*
* Each routed page inside `UserProfile` / `OrganizationProfile` should wrap its content
* in this component
*/
const ProfileCardPage = ({ children, bleeding = false, sx }) => {
	return /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.profilePageContent,
		sx: [(theme) => ({
			paddingTop: theme.space.$7,
			paddingBottom: theme.space.$7,
			paddingInlineStart: theme.space.$8,
			paddingInlineEnd: theme.space.$6,
			[mqu.sm]: { padding: `${theme.space.$8} ${theme.space.$5}` },
			...bleeding && {
				marginInlineStart: `calc(${theme.space.$8} * -1)`,
				marginInlineEnd: `calc(${theme.space.$6} * -1)`,
				[mqu.sm]: { marginInline: `calc(${theme.space.$5} * -1)` }
			}
		}), sx],
		children
	});
};

//#endregion
export { ProfileCardPage };
//# sourceMappingURL=ProfileCardPage.js.map