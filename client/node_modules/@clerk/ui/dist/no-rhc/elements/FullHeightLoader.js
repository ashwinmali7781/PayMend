import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Spinner } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/FullHeightLoader.tsx
const FullHeightLoader = () => {
	return /* @__PURE__ */ jsx(Flex, {
		center: true,
		sx: { height: "100%" },
		children: /* @__PURE__ */ jsx(Spinner, {
			colorScheme: "primary",
			size: "lg",
			elementDescriptor: descriptors.spinner
		})
	});
};

//#endregion
export { FullHeightLoader };
//# sourceMappingURL=FullHeightLoader.js.map