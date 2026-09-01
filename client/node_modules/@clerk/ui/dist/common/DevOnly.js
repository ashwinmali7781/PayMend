import { useClerk } from "@clerk/shared/react/index";

//#region src/common/DevOnly.tsx
const DevOnly = ({ children }) => {
	if (useClerk().instanceType !== "development") return null;
	return children;
};

//#endregion
export { DevOnly };
//# sourceMappingURL=DevOnly.js.map