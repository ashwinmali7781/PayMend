import { descriptors } from "../../customizables/elementDescriptors.js";
import { Text } from "../../customizables/index.js";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { getFullName, getIdentifier } from "@clerk/shared/internal/clerk-js/user";

//#region src/components/UserButton/UserButtonTopLevelIdentifier.tsx
const UserButtonTopLevelIdentifier = ({ showName }) => {
	const { user } = useUser();
	if (!user || !showName) return null;
	return /* @__PURE__ */ jsx(Text, {
		variant: "subtitle",
		as: "span",
		elementDescriptor: descriptors.userButtonOuterIdentifier,
		sx: [(t) => ({ paddingInlineStart: t.space.$2 })],
		children: getFullName(user) || getIdentifier(user)
	});
};

//#endregion
export { UserButtonTopLevelIdentifier };
//# sourceMappingURL=UserButtonTopLevelIdentifier.js.map