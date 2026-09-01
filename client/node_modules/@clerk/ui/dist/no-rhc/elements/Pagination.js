import { localizationKeys } from "../localization/localizationKeys.js";
import SvgChevronLeft from "../icons/chevron-left.js";
import SvgChevronRight from "../icons/chevron-right.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { mqu } from "../styledSystem/breakpoints.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Button, Flex, Icon, Text } from "../customizables/index.js";
import { range } from "../utils/range.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Pagination.tsx
const PageButton = (props) => {
	const { sx, isActive, icon, children, ...rest } = props;
	return /* @__PURE__ */ jsxs(Button, {
		size: "xs",
		variant: "outline",
		sx: (t) => [{
			color: t.colors.$colorForeground,
			opacity: isActive ? 1 : t.opacity.$inactive,
			padding: `${t.space.$0x5} ${t.space.$0x5}`
		}, sx],
		elementDescriptor: descriptors.paginationButton,
		...rest,
		children: [icon && /* @__PURE__ */ jsx(Icon, {
			size: "md",
			elementDescriptor: descriptors.paginationButtonIcon,
			icon: props.icon
		}), children]
	});
};
const RowInformation = (props) => {
	const { rowInfo: { startingRow, endingRow, allRowsCount } } = props;
	return /* @__PURE__ */ jsxs(Text, { children: [
		/* @__PURE__ */ jsx(Text, {
			as: "span",
			elementDescriptor: descriptors.paginationRowText,
			elementId: descriptors.paginationRowText?.setId("displaying"),
			sx: (t) => ({ opacity: t.opacity.$inactive }),
			localizationKey: localizationKeys("paginationRowText__displaying"),
			colorScheme: "secondary"
		}),
		" ",
		/* @__PURE__ */ jsx(Text, {
			as: "span",
			elementDescriptor: descriptors.paginationRowText,
			elementId: descriptors.paginationRowText?.setId("rowsCount"),
			sx: (t) => ({ fontWeight: t.fontWeights.$medium }),
			children: startingRow === endingRow && [0, 1].includes(startingRow) ? startingRow : `${startingRow} – ${endingRow}`
		}),
		" ",
		/* @__PURE__ */ jsx(Text, {
			as: "span",
			elementDescriptor: descriptors.paginationRowText,
			elementId: descriptors.paginationRowText?.setId("displaying"),
			sx: (t) => ({ opacity: t.opacity.$inactive }),
			localizationKey: localizationKeys("paginationRowText__of")
		}),
		" ",
		/* @__PURE__ */ jsx(Text, {
			as: "span",
			elementDescriptor: descriptors.paginationRowText,
			elementId: descriptors.paginationRowText?.setId("allRowsCount"),
			children: allRowsCount
		})
	] });
};
const shouldShowPageButton = (currentPage, pageToShow, siblingCount, pageCount) => {
	return Math.abs(currentPage - pageToShow) <= siblingCount || pageToShow === pageCount || pageToShow === 1;
};
const shouldShowDots = (currentPage, pageToShow, siblingCount) => {
	return Math.abs(currentPage - pageToShow) === siblingCount + 1;
};
const ThreeDots = () => /* @__PURE__ */ jsx(Flex, {
	center: true,
	children: /* @__PURE__ */ jsx(Text, {
		colorScheme: "secondary",
		children: "..."
	})
});
const Pagination = (props) => {
	const { page, count, rowInfo, siblingCount = 1, onChange } = props;
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsxs(Flex, {
		justify: rowInfo ? "between" : "center",
		align: "center",
		sx: (t) => ({
			fontSize: t.fontSizes.$sm,
			"*": { fontSize: "inherit" },
			[mqu.sm]: {
				flexDirection: "column",
				gap: t.space.$2
			}
		}),
		children: [rowInfo && /* @__PURE__ */ jsx(RowInformation, { rowInfo }), /* @__PURE__ */ jsxs(Flex, {
			gap: 2,
			align: "center",
			sx: { display: "inline-flex" },
			children: [
				/* @__PURE__ */ jsx(PageButton, {
					isDisabled: page <= 1,
					icon: SvgChevronLeft,
					"aria-label": t(localizationKeys("paginationButton__previous")),
					onClick: () => {
						onChange?.(page - 1);
					}
				}),
				range(1, count).map((p) => {
					if (shouldShowPageButton(page, p, siblingCount, count)) return /* @__PURE__ */ jsx(PageButton, {
						isActive: p === page,
						variant: "ghost",
						onClick: () => {
							onChange?.(p);
						},
						children: p
					}, p);
					if (shouldShowDots(page, p, siblingCount)) return /* @__PURE__ */ jsx(ThreeDots, {}, p);
					return null;
				}),
				/* @__PURE__ */ jsx(PageButton, {
					isDisabled: page >= count || page < 1,
					icon: SvgChevronRight,
					"aria-label": t(localizationKeys("paginationButton__next")),
					onClick: () => {
						onChange?.(page + 1);
					}
				})
			]
		})]
	});
};

//#endregion
export { Pagination };
//# sourceMappingURL=Pagination.js.map