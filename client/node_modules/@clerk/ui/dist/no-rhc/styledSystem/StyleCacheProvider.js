import { createEmotionCache } from "./createEmotionCache.js";
import React, { useMemo } from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { CacheProvider } from "@emotion/react";

//#region src/styledSystem/StyleCacheProvider.tsx
const StyleCacheProvider = (props) => {
	return /* @__PURE__ */ jsx(CacheProvider, {
		value: useMemo(() => createEmotionCache({
			nonce: props.nonce,
			cssLayerName: props.cssLayerName
		}), [props.nonce, props.cssLayerName]),
		children: props.children
	});
};

//#endregion
export { StyleCacheProvider };
//# sourceMappingURL=StyleCacheProvider.js.map