import { isomorphicAtob } from "@clerk/shared/isomorphicAtob";

//#region src/utils/image.ts
const isDefaultImage = (url) => {
	if ((url || "").includes("gravatar") || (url || "").includes("avatar_placeholder")) return true;
	try {
		const decoded = isomorphicAtob(new URL(url).pathname.replace("/", ""));
		return JSON.parse(decoded).type === "default";
	} catch {
		return false;
	}
};

//#endregion
export { isDefaultImage };
//# sourceMappingURL=image.js.map