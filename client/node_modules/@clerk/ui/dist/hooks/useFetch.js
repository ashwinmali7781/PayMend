import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

//#region src/hooks/useFetch.ts
/**
* Global cache for storing status of fetched resources
*/
let requestCache = /* @__PURE__ */ new Map();
/**
* A set to store subscribers in order to notify when the value of a key of `requestCache` changes
*/
const subscribers = /* @__PURE__ */ new Set();
const serialize = (key) => typeof key === "string" ? key : JSON.stringify(key);
const useCache = (key, serializer = serialize) => {
	const serializedKey = serializer(key);
	const get = useCallback(() => requestCache.get(serializedKey), [serializedKey]);
	const set = useCallback((data) => {
		requestCache.set(serializedKey, typeof data === "function" ? data(get()) : data);
		subscribers.forEach((callback) => callback());
	}, [serializedKey]);
	const clear = useCallback(() => {
		set({
			isLoading: false,
			isValidating: false,
			data: null,
			error: null,
			cachedAt: void 0
		});
	}, [set]);
	return {
		getCache: get,
		setCache: set,
		subscribeCache: useCallback((callback) => {
			subscribers.add(callback);
			return () => subscribers.delete(callback);
		}, []),
		clearCache: clear
	};
};
/**
* A simple data fetching hook with caching support.
* @param fetcher If fetcher is undefined no action will be performed
* @param params
* @param options
* @param resourceId
*/
const useFetch = (fetcher, params, options, resourceId) => {
	const cacheKey = {
		resourceId,
		params
	};
	const { subscribeCache, getCache, setCache, clearCache } = useCache(cacheKey);
	const { subscribeCache: subscribeRevalidationCounter, getCache: getRevalidationCounter, setCache: setRevalidationCounter } = useCache({
		...cacheKey,
		rv: true
	});
	const staleTime = options?.staleTime ?? 1e3 * 60 * 2;
	const throttleTime = options?.throttleTime || 0;
	const fetcherRef = useRef(fetcher);
	if (throttleTime < 0) throw new Error("ClerkJS: A negative value for `throttleTime` is not allowed ");
	const cached = useSyncExternalStore(subscribeCache, getCache);
	const revalidateCache = useSyncExternalStore(subscribeRevalidationCounter, getRevalidationCounter);
	const revalidate = useCallback(() => {
		setCache((d) => ({
			...d,
			cachedAt: 0
		}));
		setRevalidationCounter((d) => ({
			isLoading: false,
			isValidating: false,
			error: null,
			data: (d?.data || 0) + 1
		}));
	}, [setCache, setRevalidationCounter]);
	useEffect(() => {
		fetcherRef.current = fetcher;
		const fetcherMissing = !fetcherRef.current;
		const isCacheStale = typeof getCache()?.cachedAt === "undefined" ? true : Date.now() - (getCache()?.cachedAt || 0) >= staleTime;
		const isRequestOnGoing = getCache()?.isValidating ?? false;
		if (fetcherMissing || !isCacheStale || isRequestOnGoing) return;
		const d = performance.now();
		setCache({
			data: getCache()?.data ?? null,
			isLoading: !getCache()?.data,
			isValidating: true,
			error: null
		});
		fetcherRef.current(params).then((result) => {
			if (typeof result !== "undefined") {
				const data = Array.isArray(result) ? result : typeof result === "object" ? { ...result } : result;
				const waitTime = throttleTime - (performance.now() - d);
				setTimeout(() => {
					setCache({
						data,
						isLoading: false,
						isValidating: false,
						error: null,
						cachedAt: Date.now()
					});
					options?.onSuccess?.(data);
				}, waitTime);
			}
		}).catch((e) => {
			setCache({
				data: getCache()?.data ?? null,
				isLoading: false,
				isValidating: false,
				error: e,
				cachedAt: Date.now()
			});
			if (e) options?.onError?.(e);
		});
	}, [
		serialize(params),
		setCache,
		getCache,
		revalidateCache
	]);
	return {
		...cached,
		setCache,
		invalidate: clearCache,
		revalidate
	};
};

//#endregion
export { useFetch };
//# sourceMappingURL=useFetch.js.map