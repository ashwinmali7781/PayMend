import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";
import { QRCodeSVG } from "qrcode.react";

//#region src/common/QRCode.tsx
const QRCode = (props) => {
	const { size = 200, url, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.qrCodeRow,
		...rest,
		children: /* @__PURE__ */ jsx(Flex, {
			elementDescriptor: descriptors.qrCodeContainer,
			sx: (t) => ({
				backgroundColor: "white",
				padding: t.space.$2x5
			}),
			children: /* @__PURE__ */ jsx(QRCodeSVG, {
				value: url || "",
				size
			})
		})
	});
};

//#endregion
export { QRCode };
//# sourceMappingURL=QRCode.js.map