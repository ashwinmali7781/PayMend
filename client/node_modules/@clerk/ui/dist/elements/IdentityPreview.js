import SvgPen from "../icons/pen.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Button, Flex, Icon, Text } from "../customizables/index.js";
import { getFlagEmojiFromCountryIso, parsePhoneString } from "../utils/phoneUtils.js";
import { formatSafeIdentifier, isMaskedIdentifier } from "../utils/formatSafeIdentifier.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { iconImageUrl } from "@clerk/shared/constants";

//#region src/elements/IdentityPreview.tsx
const IdentityPreview = (props) => {
	const { t } = useLocalizations();
	const { avatarUrl = iconImageUrl("avatar_placeholder", "jpeg"), identifier, onClick, editButtonAriaLabel, ...rest } = props;
	const refs = React.useRef({
		avatarUrl,
		identifier: formatSafeIdentifier(identifier)
	});
	const edit = onClick && /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.identityPreviewEditButton,
		variant: "link",
		textVariant: "buttonSmall",
		onClick,
		"aria-label": t(editButtonAriaLabel),
		children: /* @__PURE__ */ jsx(Icon, {
			elementDescriptor: descriptors.identityPreviewEditButtonIcon,
			icon: SvgPen
		})
	});
	if (!refs.current.identifier) return /* @__PURE__ */ jsx(Container, {
		...rest,
		children: edit
	});
	if (isMaskedIdentifier(refs.current.identifier) || !refs.current.identifier.startsWith("+")) return /* @__PURE__ */ jsxs(Container, {
		...rest,
		children: [/* @__PURE__ */ jsx(UsernameOrEmailIdentifier, { ...refs.current }), edit]
	});
	const flag = getFlagEmojiFromCountryIso(parsePhoneString(refs.current.identifier || "").iso);
	return /* @__PURE__ */ jsxs(Container, {
		...rest,
		children: [/* @__PURE__ */ jsx(PhoneIdentifier, {
			identifier: refs.current.identifier,
			flag
		}), edit]
	});
};
const IdentifierContainer = (props) => {
	return /* @__PURE__ */ jsx(Text, {
		elementDescriptor: descriptors.identityPreviewText,
		colorScheme: "secondary",
		truncate: true,
		...props
	});
};
const UsernameOrEmailIdentifier = (props) => {
	return /* @__PURE__ */ jsx(IdentifierContainer, { children: props.identifier });
};
const PhoneIdentifier = (props) => {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Text, {
		sx: (t) => ({ fontSize: t.fontSizes.$sm }),
		children: props.flag
	}), /* @__PURE__ */ jsx(IdentifierContainer, { children: props.identifier })] });
};
const Container = (props) => {
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.identityPreview,
		align: "center",
		gap: 2,
		sx: { justifyContent: "center" },
		...props
	});
};

//#endregion
export { IdentityPreview };
//# sourceMappingURL=IdentityPreview.js.map