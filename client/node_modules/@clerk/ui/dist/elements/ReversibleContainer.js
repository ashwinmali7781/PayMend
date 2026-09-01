import { useAppearance } from "../customizables/AppearanceContext.js";
import { Divider } from "./Divider.js";
import React from "react";
import { Fragment as Fragment$1, jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/ReversibleContainer.tsx
const SocialButtonsReversibleContainerWithDivider = (props) => {
	const appearance = useAppearance();
	const childrenWithDivider = interleaveElementInArray(React.Children.toArray(props.children), (i) => /* @__PURE__ */ jsx(Divider, {}, `divider${i}`));
	return /* @__PURE__ */ jsx(ReversibleContainer, {
		reverse: appearance.parsedOptions.socialButtonsPlacement === "bottom",
		...props,
		children: childrenWithDivider
	});
};
const ReversibleContainer = (props) => {
	const { children, reverse } = props;
	return /* @__PURE__ */ jsx(Fragment$1, { children: reverse ? React.Children.toArray(children).reverse() : children });
};
const interleaveElementInArray = (arr, generator) => {
	return arr.reduce((acc, child, i) => {
		return i === arr.length - 1 ? [...acc, child] : [
			...acc,
			child,
			generator(i)
		];
	}, []);
};

//#endregion
export { SocialButtonsReversibleContainerWithDivider };
//# sourceMappingURL=ReversibleContainer.js.map