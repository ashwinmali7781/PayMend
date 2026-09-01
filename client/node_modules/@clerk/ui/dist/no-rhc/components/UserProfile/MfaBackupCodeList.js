import { useClipboard } from "../../hooks/useClipboard.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgArrowDownTray from "../../icons/arrow-down-tray.js";
import SvgCheckmark from "../../icons/checkmark.js";
import SvgCopy from "../../icons/copy.js";
import SvgPrint from "../../icons/print.js";
import { Box, Button, Col, Grid, Heading, Icon, Text } from "../../customizables/index.js";
import { PrintableComponent, usePrintable } from "../../common/PrintableComponent.js";
import { MfaBackupCodeTile } from "./MfaBackupCodeTile.js";
import { useUser } from "@clerk/shared/react";
import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { getIdentifier } from "@clerk/shared/internal/clerk-js/user";

//#region src/components/UserProfile/MfaBackupCodeList.tsx
const MfaBackupCodeList = (props) => {
	const { subtitle, backupCodes } = props;
	const { applicationName } = useEnvironment().displayConfig;
	const { user } = useUser();
	const { print, printableProps } = usePrintable();
	const { onCopy, hasCopied } = useClipboard(backupCodes?.join(",") || "");
	if (!user) return null;
	const userIdentifier = getIdentifier(user);
	const onDownloadTxtFile = () => {
		const element = document.createElement("a");
		const file = new Blob([txtFileContent(backupCodes, applicationName, userIdentifier)], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `${applicationName}_backup_codes.txt`;
		document.body.appendChild(element);
		element.click();
	};
	if (!backupCodes) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Box, {
		sx: (t) => ({
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha100,
			borderRadius: t.radii.$lg
		}),
		children: [
			/* @__PURE__ */ jsxs(Col, {
				gap: 1,
				sx: (t) => ({ padding: t.space.$4 }),
				children: [/* @__PURE__ */ jsx(Text, {
					localizationKey: localizationKeys("userProfile.backupCodePage.title__codelist"),
					variant: "subtitle",
					sx: { textAlign: "start" }
				}), /* @__PURE__ */ jsx(Text, {
					localizationKey: subtitle,
					variant: "body",
					sx: { textAlign: "start" },
					colorScheme: "secondary"
				})]
			}),
			/* @__PURE__ */ jsx(Grid, {
				gap: 2,
				sx: (t) => ({
					gridTemplateColumns: `repeat(2, minmax(${t.sizes.$12}, 1fr))`,
					paddingBlock: t.space.$2,
					backgroundColor: t.colors.$neutralAlpha50,
					color: t.colors.$colorMutedForeground,
					borderTopWidth: t.borderWidths.$normal,
					borderTopStyle: t.borderStyles.$solid,
					borderTopColor: t.colors.$borderAlpha100
				}),
				children: backupCodes.map((code, i) => /* @__PURE__ */ jsx(MfaBackupCodeTile, { code }, i))
			}),
			/* @__PURE__ */ jsxs(Grid, {
				sx: (t) => ({
					borderTopWidth: t.borderWidths.$normal,
					borderTopStyle: t.borderStyles.$solid,
					borderTopColor: t.colors.$borderAlpha100,
					gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,
					">:not([hidden])~:not([hidden])": {
						borderInlineEndWidth: "0px",
						borderInlineStartWidth: "1px",
						borderStyle: "solid",
						borderColor: t.colors.$borderAlpha100
					},
					">:first-child": { borderEndStartRadius: t.radii.$lg },
					">:last-child": { borderEndEndRadius: t.radii.$lg }
				}),
				children: [
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						sx: (t) => ({
							width: "100%",
							padding: `${t.space.$0x25} 0`,
							borderRadius: 0
						}),
						onClick: onDownloadTxtFile,
						children: /* @__PURE__ */ jsx(Icon, { icon: SvgArrowDownTray })
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						sx: (t) => ({
							width: "100%",
							padding: `${t.space.$2} 0`,
							borderRadius: 0
						}),
						onClick: print,
						children: /* @__PURE__ */ jsx(Icon, { icon: SvgPrint })
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						onClick: () => onCopy(),
						sx: (t) => ({
							width: "100%",
							padding: `${t.space.$2} 0`,
							borderRadius: 0
						}),
						children: /* @__PURE__ */ jsx(Icon, { icon: hasCopied ? SvgCheckmark : SvgCopy })
					})
				]
			})
		]
	}), /* @__PURE__ */ jsxs(PrintableComponent, {
		...printableProps,
		children: [/* @__PURE__ */ jsxs(Heading, { children: [
			"Your backup codes for ",
			applicationName,
			" account ",
			userIdentifier,
			":"
		] }), /* @__PURE__ */ jsx(Col, {
			gap: 2,
			children: backupCodes.map((code, i) => /* @__PURE__ */ jsx(MfaBackupCodeTile, { code }, i))
		})]
	})] });
};
function txtFileContent(backupCodes, applicationName, userIdentifier) {
	return `These are your backup codes for ${applicationName} account ${userIdentifier}.\nStore them securely and keep them secret. Each code can only be used once.\n\n${backupCodes?.join("\n")}`;
}

//#endregion
export { MfaBackupCodeList };
//# sourceMappingURL=MfaBackupCodeList.js.map