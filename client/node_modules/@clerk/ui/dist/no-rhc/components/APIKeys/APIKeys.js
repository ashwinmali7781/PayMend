import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { useAPIKeysContext } from "../../contexts/components/APIKeys.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useProtect } from "../../common/Gate.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Box, Button, Col, Flex } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Action } from "../../elements/Action/index.js";
import { Pagination } from "../../elements/Pagination.js";
import { SearchInput } from "../../elements/SearchInput.js";
import { APIKeysTable } from "./ApiKeysTable.js";
import { CreateAPIKeyForm } from "./CreateAPIKeyForm.js";
import { useAPIKeysPagination } from "./utils.js";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { lazy, useState } from "react";
import { __internal_useOrganizationBase, useAPIKeys, useClerk, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { isOrganizationId } from "@clerk/shared/internal/clerk-js/organization";

//#region src/components/APIKeys/APIKeys.tsx
const RevokeAPIKeyConfirmationModal = lazy(() => import(
	/* webpackChunkName: "revoke-api-key-modal"*/
	"./RevokeAPIKeyConfirmationModal.js"
).then((module) => ({ default: module.RevokeAPIKeyConfirmationModal })));
const CopyAPIKeyModal = lazy(() => import(
	/* webpackChunkName: "copy-api-key-modal"*/
	"./CopyAPIKeyModal.js"
).then((module) => ({ default: module.CopyAPIKeyModal })));
const apiKeysSearchDebounceMs = 500;
const API_KEYS_PAGE_SIZE = 10;
const APIKeysPage = ({ subject, perPage, revokeModalRoot }) => {
	const isOrg = isOrganizationId(subject);
	const canReadAPIKeys = useProtect({ permission: "org:sys_api_keys:read" });
	const canManageAPIKeys = useProtect({ permission: "org:sys_api_keys:manage" });
	const [searchValue, setSearchValue] = useState("");
	const query = useDebounce(searchValue, apiKeysSearchDebounceMs).trim();
	const { data: apiKeys, isLoading, isFetching, page, fetchPage, pageCount, count: itemCount, revalidate: invalidateAll } = useAPIKeys({
		subject,
		pageSize: perPage ?? API_KEYS_PAGE_SIZE,
		query,
		keepPreviousData: true,
		enabled: isOrg ? canReadAPIKeys : true
	});
	useAPIKeysPagination({
		query,
		page,
		pageCount,
		isFetching,
		fetchPage
	});
	const startingRow = itemCount > 0 ? Math.max(0, (page - 1) * (perPage ?? API_KEYS_PAGE_SIZE)) + 1 : 0;
	const endingRow = Math.min(page * (perPage ?? API_KEYS_PAGE_SIZE), itemCount);
	const handlePageChange = (newPage) => {
		fetchPage(newPage);
	};
	const card = useCardState();
	const clerk = useClerk();
	const [apiKey, setAPIKey] = useState(null);
	const { t } = useLocalizations();
	const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
	const [selectedAPIKeyID, setSelectedAPIKeyID] = useState("");
	const [selectedAPIKeyName, setSelectedAPIKeyName] = useState("");
	const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
	const handleCreateAPIKey = async (params) => {
		try {
			card.setLoading();
			const apiKey = await clerk.apiKeys.create({
				...params,
				subject
			});
			invalidateAll();
			card.setError(void 0);
			setIsCopyModalOpen(true);
			setAPIKey(apiKey);
		} catch (err) {
			if (!isClerkAPIResponseError(err)) {
				handleError(err, [], card.setError);
				return;
			}
			switch (err.errors?.[0]?.code) {
				case "token_quota_exceeded":
					card.setError(t(localizationKeys("unstable__errors.api_key_usage_exceeded")));
					break;
				case "token_creation_conflict":
					card.setError(t(localizationKeys("unstable__errors.api_key_name_already_exists")));
					break;
				default: handleError(err, [], card.setError);
			}
		} finally {
			card.setIdle();
		}
	};
	const handleRevoke = (apiKeyID, apiKeyName) => {
		setSelectedAPIKeyID(apiKeyID);
		setSelectedAPIKeyName(apiKeyName);
		setIsRevokeModalOpen(true);
	};
	return /* @__PURE__ */ jsxs(Col, {
		gap: 4,
		sx: { width: "100%" },
		elementDescriptor: descriptors.apiKeys,
		children: [
			/* @__PURE__ */ jsxs(Action.Root, { children: [
				/* @__PURE__ */ jsxs(Flex, {
					justify: "between",
					align: "center",
					gap: 4,
					sx: { [mqu.sm]: {
						flexDirection: "column",
						alignItems: "stretch"
					} },
					elementDescriptor: descriptors.apiKeysHeader,
					children: [/* @__PURE__ */ jsx(Box, {
						elementDescriptor: descriptors.apiKeysSearchBox,
						children: /* @__PURE__ */ jsx(SearchInput, {
							name: "apiKeysSearch",
							placeholder: t(localizationKeys("apiKeys.action__search")),
							"aria-label": t(localizationKeys("apiKeys.action__search")),
							value: searchValue,
							onChange: (e) => setSearchValue(e.target.value),
							onClear: () => setSearchValue(""),
							elementDescriptor: descriptors.apiKeysSearchInput
						})
					}), (isOrg && canManageAPIKeys || !isOrg) && /* @__PURE__ */ jsx(Action.Trigger, {
						value: "add-api-key",
						hideOnActive: false,
						children: /* @__PURE__ */ jsx(Button, {
							variant: "solid",
							localizationKey: localizationKeys("apiKeys.action__add"),
							elementDescriptor: descriptors.apiKeysAddButton
						})
					})]
				}),
				/* @__PURE__ */ jsx(Action.Open, {
					value: "add-api-key",
					children: /* @__PURE__ */ jsx(Flex, {
						sx: (t) => ({
							paddingTop: t.space.$6,
							paddingBottom: t.space.$6
						}),
						children: /* @__PURE__ */ jsx(Action.Card, {
							sx: { width: "100%" },
							children: /* @__PURE__ */ jsx(CreateAPIKeyForm, { onCreate: handleCreateAPIKey })
						})
					})
				}),
				/* @__PURE__ */ jsx(CopyAPIKeyModal, {
					isOpen: isCopyModalOpen,
					onOpen: () => setIsCopyModalOpen(true),
					onClose: () => setIsCopyModalOpen(false),
					apiKeyName: apiKey?.name || "",
					apiKeySecret: apiKey?.secret || "",
					modalRoot: revokeModalRoot
				})
			] }),
			/* @__PURE__ */ jsx(APIKeysTable, {
				rows: apiKeys,
				isLoading,
				onRevoke: handleRevoke,
				elementDescriptor: descriptors.apiKeysTable,
				canManageAPIKeys: isOrg && canManageAPIKeys || !isOrg
			}),
			pageCount > 1 && /* @__PURE__ */ jsx(Pagination, {
				count: pageCount,
				page: Math.min(page, pageCount),
				onChange: handlePageChange,
				siblingCount: 1,
				rowInfo: {
					allRowsCount: itemCount,
					startingRow,
					endingRow
				}
			}),
			/* @__PURE__ */ jsx(RevokeAPIKeyConfirmationModal, {
				isOpen: isRevokeModalOpen,
				onOpen: () => setIsRevokeModalOpen(true),
				onClose: () => {
					setSelectedAPIKeyID("");
					setSelectedAPIKeyName("");
					setIsRevokeModalOpen(false);
				},
				apiKeyID: selectedAPIKeyID,
				apiKeyName: selectedAPIKeyName,
				onRevokeSuccess: invalidateAll,
				modalRoot: revokeModalRoot
			})
		]
	});
};
const _APIKeys = () => {
	const ctx = useAPIKeysContext();
	const { user } = useUser();
	const subject = __internal_useOrganizationBase()?.id ?? user?.id ?? "";
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "apiKeys",
		sx: { width: "100%" },
		children: /* @__PURE__ */ jsx(APIKeysPage, {
			subject,
			perPage: ctx.perPage
		})
	});
};
const APIKeys = withCoreUserGuard(withCardStateProvider(_APIKeys));

//#endregion
export { APIKeys, APIKeysPage };
//# sourceMappingURL=APIKeys.js.map