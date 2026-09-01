//#region src/router/newPaths.ts
const newPaths = (oldIndexPath, oldFullPath, path, index) => {
	let indexPath = oldIndexPath;
	if (path) {
		indexPath = oldFullPath;
		if (!index) indexPath += "/" + path;
	}
	if (indexPath.startsWith("//")) indexPath = indexPath.substr(1);
	let fullPath = oldFullPath + (path ? "/" + path : "");
	if (fullPath.startsWith("//")) fullPath = fullPath.substr(1);
	return [indexPath, fullPath];
};

//#endregion
export { newPaths };
//# sourceMappingURL=newPaths.js.map