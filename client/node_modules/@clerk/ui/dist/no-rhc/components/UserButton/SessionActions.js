import { USER_BUTTON_ITEM_ID } from "../../constants.js";
import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgAdd from "../../icons/add.js";
import SvgArrowRight from "../../icons/arrow-right.js";
import SvgCog from "../../icons/cog.js";
import SvgSignOut from "../../icons/sign-out.js";
import { useUserButtonContext } from "../../contexts/components/UserButton.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flex } from "../../customizables/index.js";
import { Action, Actions, SmallAction, SmallActions } from "../../elements/Actions.js";
import { PreviewButton } from "../../elements/PreviewButton.js";
import { UserPreview } from "../../elements/UserPreview.js";
import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserButton/SessionActions.tsx
const SingleSessionActions = (props) => {
	const { navigate } = useRouter();
	const { handleManageAccountClicked, handleSignOutSessionClicked, handleUserProfileActionClicked, session } = props;
	const { menutItems } = useUserButtonContext();
	const { t } = useLocalizations();
	const commonActionSx = (t) => ({
		borderTopWidth: t.borderWidths.$normal,
		borderTopStyle: t.borderStyles.$solid,
		borderTopColor: t.colors.$borderAlpha100,
		padding: `${t.space.$4} ${t.space.$5}`
	});
	const handleActionClick = async (menuItem) => {
		if (menuItem?.path) {
			await navigate(menuItem.path);
			return props?.completedCallback();
		}
		if (menuItem.id === USER_BUTTON_ITEM_ID.MANAGE_ACCOUNT) return await handleManageAccountClicked();
		if (menuItem?.open) return handleUserProfileActionClicked(menuItem.open);
		menuItem.onClick?.();
		return props?.completedCallback();
	};
	return /* @__PURE__ */ jsx(Actions, {
		role: "group",
		"aria-label": t(localizationKeys("userButton.label__accountActions")),
		elementDescriptor: descriptors.userButtonPopoverActions,
		elementId: descriptors.userButtonPopoverActions.setId("singleSession"),
		sx: (t) => ({
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100
		}),
		children: menutItems?.map((item) => {
			const isDefaultItem = Object.values(USER_BUTTON_ITEM_ID).includes(item.id);
			let itemDescriptors;
			if (isDefaultItem) itemDescriptors = {
				elementDescriptor: descriptors.userButtonPopoverActionButton,
				elementId: descriptors.userButtonPopoverActionButton.setId(item.id),
				iconBoxElementDescriptor: descriptors.userButtonPopoverActionButtonIconBox,
				iconBoxElementId: descriptors.userButtonPopoverActionButtonIconBox.setId(item.id),
				iconElementDescriptor: descriptors.userButtonPopoverActionButtonIcon,
				iconElementId: descriptors.userButtonPopoverActionButtonIcon.setId(item.id)
			};
			else itemDescriptors = {
				elementDescriptor: descriptors.userButtonPopoverCustomItemButton,
				elementId: descriptors.userButtonPopoverCustomItemButton.setId(item.id),
				iconBoxElementDescriptor: descriptors.userButtonPopoverCustomItemButtonIconBox,
				iconBoxElementId: descriptors.userButtonPopoverCustomItemButtonIconBox.setId(item.id),
				iconElementDescriptor: descriptors.userButtonPopoverActionItemButtonIcon,
				iconElementId: descriptors.userButtonPopoverActionItemButtonIcon.setId(item.id)
			};
			return /* @__PURE__ */ jsx(Action, {
				...itemDescriptors,
				icon: item.icon,
				label: item.name,
				onClick: item.id === USER_BUTTON_ITEM_ID.SIGN_OUT ? handleSignOutSessionClicked(session) : () => handleActionClick(item),
				sx: commonActionSx,
				iconSx: (t) => ({
					width: t.sizes.$4,
					height: t.sizes.$4
				})
			}, item.id);
		})
	});
};
const MultiSessionActions = (props) => {
	const { navigate } = useRouter();
	const { handleManageAccountClicked, handleSignOutSessionClicked, handleSessionClicked, handleAddAccountClicked, handleUserProfileActionClicked, session, otherSessions } = props;
	const { menutItems } = useUserButtonContext();
	const { t } = useLocalizations();
	const handleActionClick = async (route) => {
		if (route?.path) {
			await navigate(route.path);
			return props?.completedCallback();
		}
		if (route.id === USER_BUTTON_ITEM_ID.MANAGE_ACCOUNT) return await handleManageAccountClicked();
		if (route?.open) return handleUserProfileActionClicked(route.open);
		route.onClick?.();
		return props?.completedCallback();
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [menutItems.every((item) => Object.values(USER_BUTTON_ITEM_ID).includes(item.id)) ? /* @__PURE__ */ jsx(SmallActions, {
		role: "group",
		"aria-label": t(localizationKeys("userButton.label__accountActions")),
		elementDescriptor: descriptors.userButtonPopoverActions,
		elementId: descriptors.userButtonPopoverActions.setId("multiSession"),
		children: /* @__PURE__ */ jsxs(Flex, {
			justify: "between",
			sx: (t) => ({
				marginInlineStart: `calc(${t.sizes.$9} + ${t.space.$4})`,
				padding: `0 ${t.space.$5} ${t.space.$4}`,
				gap: t.space.$2
			}),
			children: [/* @__PURE__ */ jsx(SmallAction, {
				elementDescriptor: descriptors.userButtonPopoverActionButton,
				elementId: descriptors.userButtonPopoverActionButton.setId("manageAccount"),
				iconBoxElementDescriptor: descriptors.userButtonPopoverActionButtonIconBox,
				iconBoxElementId: descriptors.userButtonPopoverActionButtonIconBox.setId("manageAccount"),
				iconElementDescriptor: descriptors.userButtonPopoverActionButtonIcon,
				iconElementId: descriptors.userButtonPopoverActionButtonIcon.setId("manageAccount"),
				icon: SvgCog,
				label: localizationKeys("userButton.action__manageAccount"),
				onClick: handleManageAccountClicked,
				focusRing: true
			}), /* @__PURE__ */ jsx(SmallAction, {
				elementDescriptor: descriptors.userButtonPopoverActionButton,
				elementId: descriptors.userButtonPopoverActionButton.setId("signOut"),
				iconBoxElementDescriptor: descriptors.userButtonPopoverActionButtonIconBox,
				iconBoxElementId: descriptors.userButtonPopoverActionButtonIconBox.setId("signOut"),
				iconElementDescriptor: descriptors.userButtonPopoverActionButtonIcon,
				iconElementId: descriptors.userButtonPopoverActionButtonIcon.setId("signOut"),
				icon: SvgSignOut,
				label: localizationKeys("userButton.action__signOut"),
				onClick: handleSignOutSessionClicked(session),
				focusRing: true
			})]
		})
	}) : /* @__PURE__ */ jsx(SmallActions, {
		role: "group",
		"aria-label": t(localizationKeys("userButton.label__accountActions")),
		elementDescriptor: descriptors.userButtonPopoverActions,
		elementId: descriptors.userButtonPopoverActions.setId("multiSession"),
		sx: (t) => ({
			gap: t.space.$1,
			paddingBottom: t.space.$2
		}),
		children: menutItems?.map((item) => {
			const isDefaultItem = Object.values(USER_BUTTON_ITEM_ID).includes(item.id);
			let itemDescriptors;
			if (isDefaultItem) itemDescriptors = {
				elementDescriptor: descriptors.userButtonPopoverActionButton,
				elementId: descriptors.userButtonPopoverActionButton.setId(item.id),
				iconBoxElementDescriptor: descriptors.userButtonPopoverActionButtonIconBox,
				iconBoxElementId: descriptors.userButtonPopoverActionButtonIconBox.setId(item.id),
				iconElementDescriptor: descriptors.userButtonPopoverActionButtonIcon,
				iconElementId: descriptors.userButtonPopoverActionButtonIcon.setId(item.id)
			};
			else itemDescriptors = {
				elementDescriptor: descriptors.userButtonPopoverCustomItemButton,
				elementId: descriptors.userButtonPopoverCustomItemButton.setId(item.id),
				iconBoxElementDescriptor: descriptors.userButtonPopoverCustomItemButtonIconBox,
				iconBoxElementId: descriptors.userButtonPopoverCustomItemButtonIconBox.setId(item.id),
				iconElementDescriptor: descriptors.userButtonPopoverActionItemButtonIcon,
				iconElementId: descriptors.userButtonPopoverActionItemButtonIcon.setId(item.id)
			};
			return /* @__PURE__ */ jsx(Action, {
				...itemDescriptors,
				icon: item.icon,
				label: item.name,
				onClick: item.id === USER_BUTTON_ITEM_ID.SIGN_OUT ? handleSignOutSessionClicked(session) : () => handleActionClick(item),
				sx: (t) => ({
					border: 0,
					padding: `${t.space.$2} ${t.space.$5}`,
					gap: t.space.$3x5
				}),
				iconSx: (t) => ({
					width: t.sizes.$4,
					height: t.sizes.$4
				}),
				iconBoxSx: (t) => ({
					minHeight: t.sizes.$4,
					minWidth: t.sizes.$4,
					alignItems: "center"
				})
			}, item.id);
		})
	}), /* @__PURE__ */ jsxs(Actions, {
		role: "group",
		"aria-label": t(localizationKeys("userButton.label__activeSessions")),
		sx: (t) => ({
			borderTopStyle: t.borderStyles.$solid,
			borderTopWidth: t.borderWidths.$normal,
			borderTopColor: t.colors.$borderAlpha100
		}),
		children: [otherSessions.map((session) => /* @__PURE__ */ jsx(PreviewButton, {
			icon: SvgArrowRight,
			onClick: handleSessionClicked(session),
			children: /* @__PURE__ */ jsx(UserPreview, { user: session.user })
		}, session.id)), /* @__PURE__ */ jsx(Action, {
			elementDescriptor: descriptors.userButtonPopoverActionButton,
			elementId: descriptors.userButtonPopoverActionButton.setId("addAccount"),
			iconBoxElementDescriptor: descriptors.userButtonPopoverActionButtonIconBox,
			iconBoxElementId: descriptors.userButtonPopoverActionButtonIconBox.setId("addAccount"),
			iconElementDescriptor: descriptors.userButtonPopoverActionButtonIcon,
			iconElementId: descriptors.userButtonPopoverActionButtonIcon.setId("addAccount"),
			icon: SvgAdd,
			label: localizationKeys("userButton.action__addAccount"),
			onClick: handleAddAccountClicked,
			iconSx: (t) => ({
				width: t.sizes.$9,
				height: t.sizes.$6
			}),
			iconBoxSx: (t) => ({
				minHeight: t.sizes.$9,
				minWidth: t.sizes.$6,
				alignItems: "center"
			}),
			spinnerSize: "md"
		})]
	})] });
};
const SignOutAllActions = (props) => {
	const { handleSignOutAllClicked, elementDescriptor, elementId, iconBoxElementDescriptor, iconBoxElementId, iconElementDescriptor, iconElementId, label, sx, actionSx } = props;
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsx(Actions, {
		role: "group",
		"aria-label": t(label || localizationKeys("userButton.action__signOutAll")),
		sx: [(t) => ({ padding: t.space.$2 }), sx],
		children: /* @__PURE__ */ jsx(Action, {
			elementDescriptor: elementDescriptor || descriptors.userButtonPopoverActionButton,
			elementId: elementId || descriptors.userButtonPopoverActionButton.setId("signOutAll"),
			iconBoxElementDescriptor: iconBoxElementDescriptor || descriptors.userButtonPopoverActionButtonIconBox,
			iconBoxElementId: iconBoxElementId || descriptors.userButtonPopoverActionButtonIconBox.setId("signOutAll"),
			iconElementDescriptor: iconElementDescriptor || descriptors.userButtonPopoverActionButtonIcon,
			iconElementId: iconElementId || descriptors.userButtonPopoverActionButtonIcon.setId("signOutAll"),
			icon: SvgSignOut,
			label: label || localizationKeys("userButton.action__signOutAll"),
			onClick: handleSignOutAllClicked,
			variant: "ghost",
			colorScheme: "neutral",
			sx: [(t) => ({
				backgroundColor: t.colors.$transparent,
				padding: `${t.space.$2} ${t.space.$3}`,
				borderBottomWidth: 0,
				borderRadius: t.radii.$lg
			}), actionSx],
			spinnerSize: "md"
		})
	});
};

//#endregion
export { MultiSessionActions, SignOutAllActions, SingleSessionActions };
//# sourceMappingURL=SessionActions.js.map