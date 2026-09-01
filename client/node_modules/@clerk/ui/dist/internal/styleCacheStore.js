//#region src/internal/styleCacheStore.ts
const store = /* @__PURE__ */ new WeakMap();
function getStyleCacheEntry(clerkInstance) {
	return store.get(clerkInstance);
}
function setStyleCache(clerkInstance, entry) {
	store.set(clerkInstance, entry);
}

//#endregion
export { getStyleCacheEntry, setStyleCache };
//# sourceMappingURL=styleCacheStore.js.map