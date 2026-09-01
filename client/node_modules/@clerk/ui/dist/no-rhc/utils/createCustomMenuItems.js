import { USER_BUTTON_ITEM_ID } from "../constants.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import SvgCog from "../icons/cog.js";
import SvgSignOut from "../icons/sign-out.js";
import { ExternalElementMounter } from "./ExternalElementMounter.js";
import { isDevelopmentSDK } from "./runtimeEnvironment.js";
import { sanitizeCustomLinkURL } from "./sanitizeCustomLinkURL.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/utils/createCustomMenuItems.tsx
const createUserButtonCustomMenuItems = (customMenuItems, clerk) => {
	return createCustomMenuItems({
		customMenuItems,
		getDefaultMenuItems: getUserButtonDefaultMenuItems
	}, clerk);
};
const createCustomMenuItems = ({ customMenuItems, getDefaultMenuItems }, clerk) => {
	const { INITIAL_MENU_ITEMS, validReorderItemLabels } = getDefaultMenuItems();
	const validCustomMenuItems = customMenuItems.filter((item) => {
		if (!isValidCustomMenuItem(item, validReorderItemLabels)) {
			if (isDevelopmentSDK(clerk)) console.error("Clerk: Invalid custom menu item:", item);
			return false;
		}
		return true;
	});
	if (isDevelopmentSDK(clerk)) {
		checkForDuplicateUsageOfReorderingItems(customMenuItems, validReorderItemLabels);
		warnForDuplicateLabels(validCustomMenuItems);
	}
	const { menuItems } = getMenuItems({
		customMenuItems: validCustomMenuItems,
		defaultMenuItems: INITIAL_MENU_ITEMS
	});
	return menuItems;
};
const getMenuItems = ({ customMenuItems, defaultMenuItems }) => {
	let remainingDefaultItems = defaultMenuItems.map((r) => r);
	const allItems = [...customMenuItems.map((ci, index) => {
		if (isCustomMenuLink(ci)) return {
			name: ci.label,
			id: `custom-menutItem-${index}`,
			icon: (props) => /* @__PURE__ */ jsx(ExternalElementMounter, {
				mount: ci.mountIcon,
				unmount: ci.unmountIcon,
				...props
			}),
			path: sanitizeCustomLinkURL(ci.href)
		};
		if (isCustomMenuItem(ci)) return {
			name: ci.label,
			id: `custom-menutItem-${index}`,
			icon: (props) => /* @__PURE__ */ jsx(ExternalElementMounter, {
				mount: ci.mountIcon,
				unmount: ci.unmountIcon,
				...props
			}),
			onClick: ci?.onClick
		};
		if (isCustomMenuItemWithOpen(ci)) return {
			name: ci.label,
			id: `custom-menutItem-${index}`,
			icon: (props) => /* @__PURE__ */ jsx(ExternalElementMounter, {
				mount: ci.mountIcon,
				unmount: ci.unmountIcon,
				...props
			}),
			open: ci.open
		};
		const reorderItem = defaultMenuItems.find((item) => item.id === ci.label);
		remainingDefaultItems = remainingDefaultItems.filter((item) => item.id !== ci.label);
		return { ...reorderItem };
	}), ...remainingDefaultItems];
	if (!customMenuItems.some((item) => item.label === USER_BUTTON_ITEM_ID.MANAGE_ACCOUNT)) allItems.sort((a) => {
		if (a.id === USER_BUTTON_ITEM_ID.MANAGE_ACCOUNT) return -1;
		return 0;
	});
	return { menuItems: allItems };
};
const getUserButtonDefaultMenuItems = () => {
	const INITIAL_MENU_ITEMS = [{
		name: localizationKeys("userButton.action__manageAccount"),
		id: USER_BUTTON_ITEM_ID.MANAGE_ACCOUNT,
		icon: SvgCog
	}, {
		name: localizationKeys("userButton.action__signOut"),
		id: USER_BUTTON_ITEM_ID.SIGN_OUT,
		icon: SvgSignOut
	}];
	return {
		INITIAL_MENU_ITEMS,
		validReorderItemLabels: INITIAL_MENU_ITEMS.map((r) => r.id)
	};
};
const isValidCustomMenuItem = (item, validReorderItemLabels) => {
	return (isCustomMenuLink(item) || isCustomMenuItem(item) || isCustomMenuItemWithOpen(item) || isReorderItem(item, validReorderItemLabels)) && typeof item.label === "string";
};
const isCustomMenuItem = (ci) => {
	return !!ci.label && !!ci.onClick && !ci.mount && !ci.unmount && !!ci.mountIcon && !!ci.unmountIcon;
};
const isCustomMenuItemWithOpen = (ci) => {
	return !!ci.label && !!ci.open && !ci.mount && !ci.unmount && !!ci.mountIcon && !!ci.unmountIcon;
};
const isCustomMenuLink = (ci) => {
	return !!ci.href && !!ci.label && !ci.mount && !ci.unmount && !!ci.mountIcon && !!ci.unmountIcon;
};
const isReorderItem = (ci, validItems) => {
	return !ci.mount && !ci.unmount && !ci.mountIcon && !ci.unmountIcon && validItems.some((v) => v === ci.label);
};
const checkForDuplicateUsageOfReorderingItems = (customMenuItems, validReorderItems) => {
	customMenuItems.filter((ci) => isReorderItem(ci, validReorderItems)).reduce((acc, ci) => {
		if (acc.includes(ci.label)) console.error(`Clerk: The "${ci.label}" item is used more than once when reordering pages. This may cause unexpected behavior.`);
		return [...acc, ci.label];
	}, []);
};
const warnForDuplicateLabels = (items) => {
	const labels = items.map((item) => item.label);
	const duplicates = labels.filter((label, index) => labels.indexOf(label) !== index);
	if (duplicates.length > 0) console.warn(`Clerk: Duplicate custom menu item labels found: ${duplicates.join(", ")}`);
};

//#endregion
export { createUserButtonCustomMenuItems };
//# sourceMappingURL=createCustomMenuItems.js.map