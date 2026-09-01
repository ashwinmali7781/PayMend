//#region src/utils/getClosestProfileScrollBox.ts
const profileScrollBoxRootSelector = "[data-clerk-profile-scroll-box-root]";
/**
* Returns the closest profile scroll box to the provided element.
* @param element - The element to start searching from.
* @returns The closest profile scroll box, if one exists.
*/
function getClosestProfileScrollBoxFromElement(element) {
	const portalRoot = element?.closest(profileScrollBoxRootSelector);
	return portalRoot instanceof HTMLElement ? portalRoot : void 0;
}
/**
* Returns the closest profile scroll box to the event target.
* @param mode - The mode of the component.
* @param event - The event whose target is used to find the profile scroll box.
* @returns The closest profile scroll box, if one exists.
*/
function getClosestProfileScrollBox(mode, event) {
	if (!event || mode === "mounted") return;
	return getClosestProfileScrollBoxFromElement(event.target);
}

//#endregion
export { getClosestProfileScrollBox, getClosestProfileScrollBoxFromElement };
//# sourceMappingURL=getClosestProfileScrollBox.js.map