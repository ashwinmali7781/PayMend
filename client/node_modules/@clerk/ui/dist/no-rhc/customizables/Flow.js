import { InternalThemeProvider } from "../styledSystem/InternalThemeProvider.js";
import { descriptors } from "./elementDescriptors.js";
import { generateFlowClassname } from "./classGeneration.js";
import { FlowMetadataProvider, useFlowMetadata } from "../elements/contexts/index.js";
import { InvisibleRootBox } from "../elements/InvisibleRootBox.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/customizables/Flow.tsx
const Root = (props) => {
	return /* @__PURE__ */ jsx(FlowMetadataProvider, {
		flow: props.flow,
		children: /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(InvisibleRootBox, {
			elementDescriptor: descriptors.rootBox,
			className: generateFlowClassname(props),
			...props
		}) })
	});
};
const Part = (props) => {
	const { flow } = useFlowMetadata();
	return /* @__PURE__ */ jsx(FlowMetadataProvider, {
		flow,
		part: props.part,
		children: /* @__PURE__ */ jsx(InternalThemeProvider, { children: props.children })
	});
};
const Flow = {
	Root,
	Part
};

//#endregion
export { Flow };
//# sourceMappingURL=Flow.js.map