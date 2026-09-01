import { clerkInvalidRoutingStrategy } from "@clerk/shared/internal/clerk-js/errors";

//#region src/utils/normalizeRoutingOptions.ts
const normalizeRoutingOptions = ({ routing, path }) => {
	if (!!path && !routing) return {
		routing: "path",
		path
	};
	if (routing !== "path" && !!path) return clerkInvalidRoutingStrategy(routing);
	return {
		routing,
		path
	};
};

//#endregion
export { normalizeRoutingOptions };
//# sourceMappingURL=normalizeRoutingOptions.js.map