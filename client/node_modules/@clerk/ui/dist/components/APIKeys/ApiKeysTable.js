import { localizationKeys } from "../../localization/localizationKeys.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Flex, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "../../customizables/index.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { timeAgo } from "../../utils/timeAgo.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/APIKeys/ApiKeysTable.tsx
const APIKeysTable = ({ rows, isLoading, onRevoke, elementDescriptor, canManageAPIKeys }) => {
	return /* @__PURE__ */ jsx(Flex, {
		sx: (t) => ({
			width: "100%",
			[mqu.sm]: {
				overflowX: "auto",
				padding: t.space.$0x25
			}
		}),
		children: /* @__PURE__ */ jsxs(Table, {
			sx: (t) => ({ background: t.colors.$colorBackground }),
			elementDescriptor,
			children: [/* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
				/* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys("apiKeys.tableHeader__name") }),
				/* @__PURE__ */ jsx(Th, { localizationKey: localizationKeys("apiKeys.tableHeader__lastUsed") }),
				canManageAPIKeys && /* @__PURE__ */ jsx(Th, {
					localizationKey: localizationKeys("apiKeys.tableHeader__actions"),
					sx: { textAlign: "end" }
				})
			] }) }), /* @__PURE__ */ jsx(Tbody, { children: isLoading ? /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, {
				colSpan: 3,
				children: /* @__PURE__ */ jsx(Spinner, {
					colorScheme: "primary",
					sx: {
						margin: "auto",
						display: "block"
					},
					elementDescriptor: descriptors.spinner
				})
			}) }) : !rows.length ? /* @__PURE__ */ jsx(EmptyRow, {}) : rows.map((apiKey) => /* @__PURE__ */ jsxs(Tr, { children: [
				/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Flex, {
					direction: "col",
					sx: { minWidth: "25ch" },
					children: [/* @__PURE__ */ jsx(Text, {
						variant: "subtitle",
						truncate: true,
						children: apiKey.name
					}), /* @__PURE__ */ jsx(Text, {
						variant: "caption",
						colorScheme: "secondary",
						localizationKey: apiKey.expiration ? localizationKeys("apiKeys.createdAndExpirationStatus__expiresOn", {
							createdDate: apiKey.createdAt,
							expiresDate: apiKey.expiration
						}) : localizationKeys("apiKeys.createdAndExpirationStatus__never", { createdDate: apiKey.createdAt })
					})]
				}) }),
				/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Box, {
					sx: { minWidth: "10ch" },
					children: /* @__PURE__ */ jsx(Text, { localizationKey: apiKey.lastUsedAt ? timeAgo(apiKey.lastUsedAt) : "-" })
				}) }),
				canManageAPIKeys && /* @__PURE__ */ jsx(Td, {
					sx: { textAlign: "end" },
					children: /* @__PURE__ */ jsx(ThreeDotsMenu, { actions: [{
						label: localizationKeys("apiKeys.menuAction__revoke"),
						isDestructive: true,
						onClick: () => onRevoke(apiKey.id, apiKey.name)
					}] })
				})
			] }, apiKey.id)) })]
		})
	});
};
const EmptyRow = () => {
	return /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, {
		colSpan: 4,
		children: /* @__PURE__ */ jsx(Text, {
			localizationKey: localizationKeys("apiKeys.detailsTitle__emptyRow"),
			sx: {
				margin: "auto",
				display: "block",
				width: "fit-content"
			}
		})
	}) });
};

//#endregion
export { APIKeysTable };
//# sourceMappingURL=ApiKeysTable.js.map