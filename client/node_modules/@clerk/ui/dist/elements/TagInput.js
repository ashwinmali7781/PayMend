import SvgPlus from "../icons/plus.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Icon, Input, Text } from "../customizables/index.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/TagInput.tsx
const sanitize = (val) => val.trim();
const TagInput = (props) => {
	const { t } = useLocalizations();
	const { autoFocus: optionAutoFocus } = useAppearance().parsedOptions;
	const { sx, placeholder, validate = () => true, value: valueProp, onChange: onChangeProp, autoFocus: autoFocusProp, validateUnsubmittedEmail = () => null, ...rest } = props;
	const autoFocus = optionAutoFocus && autoFocusProp;
	const tags = valueProp.split(",").map(sanitize).filter(Boolean);
	const tagsSet = new Set(tags);
	const keyReleasedRef = React.useRef(true);
	const inputRef = React.useRef(null);
	const [input, setInput] = React.useState("");
	const emit = (newTags) => {
		onChangeProp({ target: { value: newTags.join(",") } });
		focusInput();
		validateUnsubmittedEmail("");
	};
	const remove = (tag) => {
		emit(tags.filter((t) => t !== tag));
	};
	const removeLast = () => {
		emit(tags.slice(0, -1));
	};
	const addTag = (tag) => {
		const newTags = (Array.isArray(tag) ? [...tag] : [tag]).map(sanitize).filter(Boolean).filter(validate).filter((t) => !tagsSet.has(t));
		if (newTags.length) {
			emit([...tags, ...newTags]);
			setInput("");
			focusInput();
		}
	};
	const focusInput = () => {
		inputRef.current?.focus();
	};
	const handleKeyDown = (e) => {
		const { key } = e;
		if ((key === "," || key === " " || key === "Enter") && !!input.length) {
			e.preventDefault();
			addTag(input);
		} else if (key === "Backspace" && !input.length && !!tags.length && keyReleasedRef.current) {
			e.preventDefault();
			removeLast();
		}
		keyReleasedRef.current = false;
	};
	const handleOnBlur = (e) => {
		e.preventDefault();
		addTag(input);
	};
	const handleKeyUp = () => {
		keyReleasedRef.current = true;
	};
	const handleChange = (e) => {
		setInput(e.target.value);
		validateUnsubmittedEmail(e.target.value);
	};
	const handlePaste = (e) => {
		const inputValue = e.clipboardData?.getData("text");
		if (inputValue === void 0) return;
		e.preventDefault();
		addTag((inputValue || "").split(/,| |\n|\t/).filter(Boolean).map((tag) => tag.trim()));
	};
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.tagInputContainer,
		align: "start",
		gap: 2,
		wrap: "wrap",
		onClick: focusInput,
		onFocus: focusInput,
		sx: [(t) => ({
			alignContent: "flex-start",
			maxWidth: "100%",
			padding: `${t.space.$1x5} ${t.space.$2}`,
			backgroundColor: t.colors.$colorInput,
			color: t.colors.$colorInputForeground,
			minHeight: t.sizes.$20,
			maxHeight: t.sizes.$60,
			overflowY: "auto",
			cursor: "text",
			justifyItems: "center",
			...common.borderVariants(t, { hoverStyles: true }).normal
		}), sx],
		...rest,
		children: [tags.map((tag) => /* @__PURE__ */ jsx(TagPill, {
			onRemoveClick: () => remove(tag),
			children: tag
		}, tag)), /* @__PURE__ */ jsx(Input, {
			ref: inputRef,
			value: input,
			type: "email",
			"data-testid": "tag-input",
			placeholder: !tags.length ? t(placeholder) : void 0,
			onKeyDown: handleKeyDown,
			onKeyUp: handleKeyUp,
			onChange: handleChange,
			onPaste: handlePaste,
			onBlur: handleOnBlur,
			focusRing: false,
			autoFocus,
			variant: "unstyled",
			sx: (t) => ({
				flexGrow: 1,
				borderWidth: 0,
				width: "initial",
				padding: 0,
				lineHeight: t.space.$5,
				paddingInlineStart: t.space.$1,
				"::placeholder": { color: t.colors.$colorMutedForeground },
				boxShadow: "none",
				":hover": { boxShadow: "none" }
			})
		})]
	});
};
const TagPill = (props) => {
	const { onRemoveClick, children, ...rest } = props;
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.tagPillContainer,
		onClick: onRemoveClick,
		gap: 1,
		center: true,
		...rest,
		sx: (t) => ({
			padding: `${t.space.$0x5} ${t.space.$1x5}`,
			borderRadius: t.radii.$sm,
			color: t.colors.$primary500,
			backgroundColor: t.colors.$neutralAlpha50,
			boxShadow: t.shadows.$badge,
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha100,
			display: "inline-flex",
			marginInlineEnd: "1px",
			cursor: "pointer",
			":hover": { backgroundColor: t.colors.$neutralAlpha100 },
			":hover svg": { color: t.colors.$danger500 },
			overflow: "hidden"
		}),
		children: [/* @__PURE__ */ jsx(Text, {
			truncate: true,
			variant: "buttonSmall",
			children
		}), /* @__PURE__ */ jsx(Icon, {
			elementDescriptor: descriptors.tagPillIcon,
			size: "md",
			icon: SvgPlus,
			sx: (t) => ({
				color: t.colors.$colorMutedForeground,
				transform: "translateY(0px) rotate(45deg)"
			})
		})]
	});
};

//#endregion
export { TagInput };
//# sourceMappingURL=TagInput.js.map