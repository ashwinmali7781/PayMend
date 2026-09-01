import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "../elements/contexts/index.js";
import { Flex, Grid, SimpleButton, Spinner, Text } from "../customizables/index.js";
import { Card } from "../elements/Card/index.js";
import { Header } from "../elements/Header.js";
import { useState } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/common/ChooseEnterpriseConnectionCard.tsx
/**
* @experimental
*/
const ChooseEnterpriseConnectionCard = ({ title, subtitle, onClick, enterpriseConnections }) => {
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			showLogo: true,
			children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: title }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: subtitle })]
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsx(Grid, {
			elementDescriptor: descriptors.enterpriseConnectionsRoot,
			gap: 2,
			children: enterpriseConnections?.map(({ id, name }) => /* @__PURE__ */ jsx(ChooseEnterpriseConnectionButton, {
				id,
				label: name,
				onClick
			}, id))
		})
	] }), /* @__PURE__ */ jsx(Card.Footer, {})] });
};
const ChooseEnterpriseConnectionButton = (props) => {
	const { label, onClick, ...rest } = props;
	const [isLoading, setIsLoading] = useState(false);
	const handleClick = () => {
		setIsLoading(true);
		onClick(props.id).catch(() => setIsLoading(false));
	};
	return /* @__PURE__ */ jsx(SimpleButton, {
		elementDescriptor: descriptors.enterpriseConnectionButton,
		variant: "outline",
		block: true,
		isLoading,
		hoverAsFocus: true,
		onClick: handleClick,
		...rest,
		sx: (theme) => [{
			gap: theme.space.$4,
			position: "relative",
			justifyContent: "flex-start"
		}, rest.sx],
		children: /* @__PURE__ */ jsxs(Flex, {
			justify: "center",
			align: "center",
			as: "span",
			gap: 3,
			sx: {
				width: "100%",
				overflow: "hidden"
			},
			children: [isLoading && /* @__PURE__ */ jsx(Flex, {
				as: "span",
				center: true,
				sx: (theme) => ({ flex: `0 0 ${theme.space.$4}` }),
				children: /* @__PURE__ */ jsx(Spinner, {
					size: "sm",
					elementDescriptor: descriptors.spinner
				})
			}), /* @__PURE__ */ jsx(Text, {
				elementDescriptor: descriptors.enterpriseConnectionButtonText,
				as: "span",
				truncate: true,
				variant: "buttonLarge",
				children: label
			})]
		})
	});
};

//#endregion
export { ChooseEnterpriseConnectionCard };
//# sourceMappingURL=ChooseEnterpriseConnectionCard.js.map