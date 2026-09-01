import { stubRouter } from "./stubRouter.js";
import { useMemo, useState } from "react";

//#region src/composed/useBillingRouter.ts
function resolveNavigation(to) {
	let path = to;
	while (path.startsWith("../")) path = path.slice(3);
	if (!path || path === "/") return { page: "billing" };
	if (path === "plans") return { page: "plans" };
	const statementMatch = path.match(/^statement\/(.+)$/);
	if (statementMatch) return {
		page: "statement",
		statementId: statementMatch[1]
	};
	const paymentMatch = path.match(/^payment-attempt\/(.+)$/);
	if (paymentMatch) return {
		page: "payment-attempt",
		paymentAttemptId: paymentMatch[1]
	};
	return { page: "billing" };
}
function pathFromRoute(route) {
	switch (route.page) {
		case "plans": return "billing/plans";
		case "statement": return `billing/statement/${route.statementId}`;
		case "payment-attempt": return `billing/payment-attempt/${route.paymentAttemptId}`;
		default: return "billing";
	}
}
function paramsFromRoute(route) {
	switch (route.page) {
		case "statement": return { statementId: route.statementId };
		case "payment-attempt": return { paymentAttemptId: route.paymentAttemptId };
		default: return {};
	}
}
function useBillingRouter() {
	const [route, setRoute] = useState({ page: "billing" });
	const [queryParams, setQueryParams] = useState({});
	return {
		router: useMemo(() => ({
			...stubRouter,
			currentPath: pathFromRoute(route),
			params: paramsFromRoute(route),
			queryParams,
			queryString: new URLSearchParams(queryParams).toString(),
			navigate: async (to, options) => {
				try {
					if (new URL(to).origin !== window.location.origin) {
						window.location.href = to;
						return;
					}
				} catch {}
				const newRoute = resolveNavigation(to);
				setRoute(newRoute);
				if (options?.searchParams) setQueryParams(Object.fromEntries(options.searchParams.entries()));
				else if (newRoute.page !== route.page) setQueryParams({});
			}
		}), [route, queryParams]),
		route
	};
}

//#endregion
export { useBillingRouter };
//# sourceMappingURL=useBillingRouter.js.map