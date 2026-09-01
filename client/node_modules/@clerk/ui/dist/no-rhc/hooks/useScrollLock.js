//#region src/hooks/useScrollLock.ts
function getPlatform() {
	const uaData = navigator.userAgentData;
	if (uaData?.platform) return uaData.platform;
	return navigator.platform;
}
let lockCount = 0;
function enableScrollLock() {
	const isIOS = /iP(hone|ad|od)|iOS/.test(getPlatform());
	const bodyStyle = document.body.style;
	const paddingProp = Math.round(document.documentElement.getBoundingClientRect().left) + document.documentElement.scrollLeft ? "paddingLeft" : "paddingRight";
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
	const scrollX = bodyStyle.left ? parseFloat(bodyStyle.left) : window.scrollX;
	const scrollY = bodyStyle.top ? parseFloat(bodyStyle.top) : window.scrollY;
	bodyStyle.overflow = "hidden";
	if (scrollbarWidth) bodyStyle[paddingProp] = `${scrollbarWidth}px`;
	if (isIOS) {
		const offsetLeft = window.visualViewport?.offsetLeft || 0;
		const offsetTop = window.visualViewport?.offsetTop || 0;
		Object.assign(bodyStyle, {
			position: "fixed",
			top: `${-(scrollY - Math.floor(offsetTop))}px`,
			left: `${-(scrollX - Math.floor(offsetLeft))}px`,
			right: "0"
		});
	}
	return () => {
		Object.assign(bodyStyle, {
			overflow: "",
			[paddingProp]: ""
		});
		if (isIOS) {
			Object.assign(bodyStyle, {
				position: "",
				top: "",
				left: "",
				right: ""
			});
			window.scrollTo(scrollX, scrollY);
		}
	};
}
let cleanup = () => {};
function useScrollLock() {
	return {
		enableScrollLock: () => {
			lockCount++;
			if (lockCount === 1) cleanup = enableScrollLock();
		},
		disableScrollLock: () => {
			lockCount--;
			if (lockCount === 0) cleanup();
		}
	};
}

//#endregion
export { useScrollLock };
//# sourceMappingURL=useScrollLock.js.map