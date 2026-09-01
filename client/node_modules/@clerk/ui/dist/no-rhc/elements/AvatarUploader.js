import { localizationKeys } from "../localization/localizationKeys.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { Button, Col, Flex, SimpleButton, Text } from "../customizables/index.js";
import { handleError } from "../utils/errorHandler.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/AvatarUploader.tsx
const fileToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};
const MAX_SIZE_BYTES = 10 * 1e3 * 1e3;
const SUPPORTED_MIME_TYPES = Object.freeze([
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp"
]);
const validType = (f) => SUPPORTED_MIME_TYPES.includes(f.type);
const validSize = (f) => f.size <= MAX_SIZE_BYTES;
const AvatarUploader = (props) => {
	const { t } = useLocalizations();
	const [objectUrl, setObjectUrl] = React.useState();
	const [isDraggingOver, setIsDraggingOver] = React.useState(false);
	const card = useCardState();
	const inputRef = React.useRef(null);
	const openDialog = () => inputRef.current?.click();
	const { onAvatarChange, onAvatarRemove, title, avatarPreview, avatarPreviewPlaceholder, rounded = true, ...rest } = props;
	const handleFileDrop = (file) => {
		if (file === null) return setObjectUrl("");
		fileToBase64(file).then(setObjectUrl);
		card.setLoading();
		return onAvatarChange(file).then(() => {
			card.setIdle();
		}).catch((err) => handleError(err, [], card.setError));
	};
	const handleRemove = async () => {
		card.setLoading();
		await handleFileDrop(null);
		card.setIdle();
		return onAvatarRemove?.();
	};
	const upload = async (f) => {
		if (!f) return;
		if (!validType(f)) {
			card.setError(t(localizationKeys("unstable__errors.avatar_file_type_invalid")));
			return;
		}
		if (!validSize(f)) {
			card.setError(t(localizationKeys("unstable__errors.avatar_file_size_exceeded")));
			return;
		}
		await handleFileDrop(f);
	};
	const isFileDrag = (e) => e.dataTransfer?.types?.includes("Files") ?? false;
	const handleDragEnter = (e) => {
		if (card.isLoading || !isFileDrag(e)) return;
		e.preventDefault();
		setIsDraggingOver(true);
	};
	const handleDragOver = (e) => {
		if (card.isLoading || !isFileDrag(e)) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
	};
	const handleDragLeave = (e) => {
		if (e.currentTarget.contains(e.relatedTarget)) return;
		setIsDraggingOver(false);
	};
	const handleDrop = (e) => {
		if (!isFileDrag(e)) return;
		e.preventDefault();
		setIsDraggingOver(false);
		if (card.isLoading) return;
		upload(e.dataTransfer.files?.[0]);
	};
	const hasExistingImage = !!avatarPreview.props?.imageUrl;
	const previewElement = objectUrl ? React.cloneElement(avatarPreview, { imageUrl: objectUrl }) : avatarPreviewPlaceholder && !hasExistingImage ? React.cloneElement(avatarPreviewPlaceholder, { onClick: openDialog }) : avatarPreview;
	return /* @__PURE__ */ jsxs(Col, {
		gap: 4,
		children: [/* @__PURE__ */ jsx("input", {
			type: "file",
			accept: SUPPORTED_MIME_TYPES.join(","),
			style: { display: "none" },
			ref: inputRef,
			onChange: (e) => upload(e.currentTarget.files?.[0])
		}), /* @__PURE__ */ jsxs(Flex, {
			...rest,
			gap: 4,
			align: "center",
			onDragEnter: handleDragEnter,
			onDragOver: handleDragOver,
			onDragLeave: handleDragLeave,
			onDrop: handleDrop,
			children: [/* @__PURE__ */ jsx(Flex, {
				sx: (t) => ({
					borderRadius: isDraggingOver && rounded ? t.radii.$circle : t.radii.$md,
					transitionProperty: t.transitionProperty.$common,
					transitionDuration: t.transitionDuration.$controls,
					transitionTimingFunction: t.transitionTiming.$common,
					...isDraggingOver && {
						outline: `${t.borderWidths.$normal} dashed ${t.colors.$primary500}`,
						outlineOffset: t.space.$0x5
					}
				}),
				children: previewElement
			}), /* @__PURE__ */ jsxs(Col, {
				gap: 1,
				children: [/* @__PURE__ */ jsxs(Flex, {
					elementDescriptor: descriptors.avatarImageActions,
					gap: 2,
					children: [/* @__PURE__ */ jsx(SimpleButton, {
						elementDescriptor: descriptors.avatarImageActionsUpload,
						localizationKey: localizationKeys("userProfile.profilePage.imageFormSubtitle"),
						isDisabled: card.isLoading,
						variant: "outline",
						size: "xs",
						onClick: openDialog
					}), !!onAvatarRemove && /* @__PURE__ */ jsx(Button, {
						elementDescriptor: descriptors.avatarImageActionsRemove,
						localizationKey: localizationKeys("userProfile.profilePage.imageFormDestructiveActionSubtitle"),
						isDisabled: card.isLoading,
						sx: (t) => ({ color: t.colors.$danger500 }),
						variant: "ghost",
						colorScheme: "danger",
						onClick: handleRemove,
						size: "xs"
					})]
				}), /* @__PURE__ */ jsx(Text, {
					colorScheme: "secondary",
					sx: (t) => ({ fontSize: t.fontSizes.$sm }),
					localizationKey: localizationKeys("userProfile.profilePage.fileDropAreaHint")
				})]
			})]
		})]
	});
};

//#endregion
export { AvatarUploader };
//# sourceMappingURL=AvatarUploader.js.map