import SvgCheckmark from "../../icons/checkmark.js";
import SvgChevronUpDown from "../../icons/chevron-up-down.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flex, Icon, Input, Text } from "../../customizables/index.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { Select, SelectButton, SelectOptionList } from "../Select.js";
import { IsoToCountryMap } from "./countryCodeData.js";
import { useFormattedPhoneNumber } from "./useFormattedPhoneNumber.js";
import React, { forwardRef, memo, useEffect, useMemo, useRef } from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/PhoneInput/index.tsx
const createSelectOption = (country) => {
	return {
		searchTerm: `${country.iso} ${country.name} ${country.code}`,
		value: `${country.iso} ${country.name} ${country.code}`,
		country
	};
};
const countryOptions = [...IsoToCountryMap.values()].map(createSelectOption);
const PhoneInputBase = forwardRef((props, ref) => {
	const { onChange: onChangeProp, value, locationBasedCountryIso, feedbackType, sx, ...rest } = props;
	const phoneInputRef = useRef(null);
	const phoneInputBox = useRef(null);
	const { setNumber, setIso, setNumberAndIso, numberWithCode, iso, formattedNumber } = useFormattedPhoneNumber({
		initPhoneWithCode: value,
		locationBasedCountryIso
	});
	const callOnChangeProp = () => {
		onChangeProp?.({ target: { value: numberWithCode } });
	};
	const selectedCountryOption = useMemo(() => {
		return countryOptions.find((o) => o.country.iso === iso) || countryOptions[0];
	}, [iso]);
	useEffect(callOnChangeProp, [numberWithCode]);
	const handlePaste = (e) => {
		const inputValue = e.clipboardData?.getData("text");
		if (inputValue === void 0) return;
		e.preventDefault();
		if (inputValue.includes("+")) setNumberAndIso(inputValue);
		else setNumber(inputValue);
	};
	const handlePhoneNumberChange = (e) => {
		const inputValue = e.target.value;
		if (inputValue.includes("+")) setNumberAndIso(inputValue);
		else setNumber(inputValue);
	};
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.phoneInputBox,
		direction: "row",
		hasError: rest.hasError,
		"data-feedback": feedbackType,
		ref: phoneInputBox,
		sx: (theme) => ({
			...common.borderVariants(theme, { hasError: rest.hasError }).normal,
			position: "relative",
			borderRadius: theme.radii.$md,
			zIndex: 1,
			"&:has(:focus-visible),&:focus-within": { ...common.borderVariants(theme, { hasError: rest.hasError }).normal["&:focus-visible"] }
		}),
		children: [/* @__PURE__ */ jsxs(Select, {
			elementId: "countryCode",
			value: selectedCountryOption.value,
			options: countryOptions,
			portal: true,
			referenceElement: phoneInputBox,
			renderOption: (option, _index, isSelected) => /* @__PURE__ */ jsx(CountryCodeListItem, {
				sx: (theme) => ({
					"&:hover": { backgroundColor: theme.colors.$neutralAlpha50 },
					"&[data-focused=\"true\"]": { backgroundColor: theme.colors.$neutralAlpha50 }
				}),
				isSelected,
				country: option.country
			}),
			onChange: (option) => {
				setIso(option.country.iso);
				phoneInputRef.current?.focus();
			},
			noResultsMessage: "No countries found",
			searchPlaceholder: "Search country or code",
			comparator: (term, option) => option.searchTerm.toLowerCase().includes(term.toLowerCase()),
			children: [/* @__PURE__ */ jsx(SelectButton, {
				variant: "ghost",
				sx: (t) => ({
					borderWidth: "0",
					borderRadius: t.radii.$md,
					borderEndEndRadius: "0",
					borderStartEndRadius: "0",
					paddingInlineEnd: t.space.$2,
					"&:focus-visible": {
						zIndex: 2,
						boxShadow: "none"
					},
					":active": { zIndex: 2 }
				}),
				hoverAsFocus: true,
				isDisabled: rest.isDisabled,
				icon: SvgChevronUpDown,
				iconSx: (t) => ({ color: rest.isDisabled ? t.colors.$neutralAlpha300 : t.colors.$neutralAlpha500 }),
				children: /* @__PURE__ */ jsx(Text, {
					colorScheme: "body",
					as: "span",
					sx: { textTransform: "uppercase" },
					children: iso
				})
			}), /* @__PURE__ */ jsx(SelectOptionList, {
				sx: { padding: 0 },
				containerSx: (theme) => ({
					overflowX: "clip",
					gap: theme.space.$0x5,
					paddingBlock: theme.space.$1,
					paddingInline: theme.space.$0x5,
					scrollPaddingBlock: theme.space.$1
				})
			})]
		}), /* @__PURE__ */ jsxs(Flex, {
			sx: {
				position: "relative",
				width: "100%"
			},
			children: [/* @__PURE__ */ jsxs(Text, {
				sx: (t) => ({
					display: "flex",
					alignItems: "center",
					pointerEvents: "none",
					paddingInlineStart: t.space.$0x5,
					opacity: props.isDisabled ? t.opacity.$disabled : 1
				}),
				children: ["+", selectedCountryOption.country.code]
			}), /* @__PURE__ */ jsx(Input, {
				value: formattedNumber,
				variant: "unstyled",
				onPaste: handlePaste,
				onChange: handlePhoneNumberChange,
				maxLength: 25,
				type: "tel",
				sx: [(t) => ({
					boxShadow: "none",
					height: "100%",
					transitionProperty: t.transitionProperty.$common,
					transitionTimingFunction: t.transitionTiming.$common,
					transitionDuration: t.transitionDuration.$focusRing,
					"&[type=tel]": {
						borderRadius: t.radii.$md,
						borderWidth: 0,
						borderStartStartRadius: 0,
						borderEndStartRadius: 0,
						paddingInlineStart: t.space.$1,
						"&:focus-visible": {
							borderColor: "unset",
							boxShadow: "unset"
						}
					}
				}), sx],
				ref: mergeRefs(phoneInputRef, ref),
				...rest
			})]
		})]
	});
});
const CountryCodeListItem = memo((props) => {
	const { country, isSelected, sx, ...rest } = props;
	return /* @__PURE__ */ jsxs(Flex, {
		center: true,
		sx: [(theme) => ({
			position: "relative",
			width: "100%",
			gap: theme.space.$2,
			padding: `${theme.space.$1x5} ${theme.space.$4}`,
			color: theme.colors.$colorForeground,
			borderRadius: theme.radii.$sm,
			"&::after": {
				content: "\"\"",
				position: "absolute",
				inset: `calc(${theme.space.$0x25} * -1) calc(${theme.space.$1} * -1)`
			}
		}), sx],
		...rest,
		children: [
			/* @__PURE__ */ jsx(Icon, {
				icon: SvgCheckmark,
				sx: { visibility: isSelected ? "visible" : "hidden" }
			}),
			/* @__PURE__ */ jsx(Text, {
				as: "div",
				sx: {
					width: "100%",
					textAlign: "start"
				},
				children: country.name
			}),
			/* @__PURE__ */ jsxs(Text, {
				colorScheme: "secondary",
				children: ["+", country.code]
			})
		]
	});
});
const PhoneInput = forwardRef((props, ref) => {
	const { __internal_country } = useClerk();
	return /* @__PURE__ */ jsx(PhoneInputBase, {
		...props,
		locationBasedCountryIso: __internal_country,
		ref
	});
});

//#endregion
export { PhoneInput };
//# sourceMappingURL=index.js.map