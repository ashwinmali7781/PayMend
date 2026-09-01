import { common } from "../../../styledSystem/common.js";
import { mqu } from "../../../styledSystem/breakpoints.js";
import { descriptors } from "../../../customizables/elementDescriptors.js";
import { Flex } from "../../../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/elements/ProfileCard.tsx
const ProfileCardHeader = (props) => /* @__PURE__ */ jsx(Flex, {
	as: "header",
	elementDescriptor: descriptors.configureSSOHeader,
	...props,
	sx: (theme) => ({
		gap: theme.space.$4,
		width: "100%",
		minHeight: theme.sizes.$13,
		padding: theme.space.$5,
		borderBottomWidth: theme.borderWidths.$normal,
		borderBottomStyle: theme.borderStyles.$solid,
		borderBottomColor: theme.colors.$borderAlpha100,
		[mqu.md]: {
			flexDirection: "column",
			alignItems: "flex-start",
			gap: theme.space.$4
		}
	})
});
const ProfileCardFooter = (props) => /* @__PURE__ */ jsx(Flex, {
	as: "footer",
	elementDescriptor: descriptors.configureSSOFooter,
	align: "center",
	justify: "end",
	...props,
	sx: (theme) => ({
		gap: theme.space.$2,
		minHeight: theme.sizes.$16,
		padding: theme.space.$4,
		background: common.mutedBackground(theme),
		borderTopWidth: theme.borderWidths.$normal,
		borderTopStyle: theme.borderStyles.$solid,
		borderTopColor: theme.colors.$borderAlpha100
	})
});

//#endregion
export { ProfileCardFooter, ProfileCardHeader };
//# sourceMappingURL=ProfileCard.js.map