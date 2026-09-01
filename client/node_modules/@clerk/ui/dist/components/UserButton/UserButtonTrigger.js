import { localizationKeys } from "../../localization/localizationKeys.js";
import { useUserButtonContext } from "../../contexts/components/UserButton.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Button, Flex } from "../../customizables/index.js";
import { UserAvatar } from "../../elements/UserAvatar.js";
import { withAvatarShimmer } from "../../elements/withAvatarShimmer.js";
import { UserButtonTopLevelIdentifier } from "./UserButtonTopLevelIdentifier.js";
import { forwardRef } from "react";
import { useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserButton/UserButtonTrigger.tsx
const UserButtonTrigger = withAvatarShimmer(forwardRef((props, ref) => {
	const { sx, ...rest } = props;
	const { user } = useUser();
	const { showName } = useUserButtonContext();
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.userButtonTrigger,
		variant: "roundWrapper",
		sx: [(t) => ({
			borderRadius: showName ? t.radii.$md : t.radii.$circle,
			color: t.colors.$colorForeground
		}), sx],
		ref,
		"aria-label": `${props.isOpen ? t(localizationKeys("userButton.action__closeUserMenu")) : t(localizationKeys("userButton.action__openUserMenu"))}`,
		"aria-expanded": props.isOpen,
		"aria-haspopup": "dialog",
		...rest,
		children: /* @__PURE__ */ jsxs(Flex, {
			elementDescriptor: descriptors.userButtonBox,
			isOpen: props.isOpen,
			align: "center",
			as: "span",
			gap: 2,
			children: [/* @__PURE__ */ jsx(UserButtonTopLevelIdentifier, { showName }), /* @__PURE__ */ jsx(UserAvatar, {
				boxElementDescriptor: descriptors.userButtonAvatarBox,
				imageElementDescriptor: descriptors.userButtonAvatarImage,
				...user,
				size: (theme) => theme.sizes.$7
			})]
		})
	});
}));

//#endregion
export { UserButtonTrigger };
//# sourceMappingURL=UserButtonTrigger.js.map