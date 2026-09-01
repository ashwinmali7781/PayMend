import { Flex, Text } from "../../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/MfaBackupCodeTile.tsx
const MfaBackupCodeTile = (props) => {
	const { code } = props;
	return /* @__PURE__ */ jsx(Flex, {
		center: true,
		sx: (t) => ({ padding: `${t.space.$1} ${t.space.$4}` }),
		children: /* @__PURE__ */ jsx(Text, { children: code })
	});
};

//#endregion
export { MfaBackupCodeTile };
//# sourceMappingURL=MfaBackupCodeTile.js.map