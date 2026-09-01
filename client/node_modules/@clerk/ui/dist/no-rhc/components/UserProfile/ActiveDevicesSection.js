import { useFetch } from "../../hooks/useFetch.js";
import { useLoadingStatus } from "../../hooks/useLoadingStatus.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgDeviceLaptop from "../../icons/device-laptop.js";
import SvgDeviceMobile from "../../icons/device-mobile.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Badge, Col, Flex, Icon, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { ProfileSection } from "../../elements/Section.js";
import { currentSessionFirst } from "./utils.js";
import { FullHeightLoader } from "../../elements/FullHeightLoader.js";
import { getRelativeToNowDateKey } from "../../utils/getRelativeToNowDateKey.js";
import { useReverification, useSession, useUser } from "@clerk/shared/react";
import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/ActiveDevicesSection.tsx
const ActiveDevicesSection = () => {
	const { user } = useUser();
	const { session } = useSession();
	const { data: sessions, isLoading } = useFetch(user?.getSessions, { userId: user?.id }, void 0, "user-sessions");
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys("userProfile.start.activeDevicesSection.title"),
		centered: false,
		id: "activeDevices",
		children: /* @__PURE__ */ jsx(ProfileSection.ItemList, {
			id: "activeDevices",
			disableAnimation: true,
			children: isLoading ? /* @__PURE__ */ jsx(FullHeightLoader, {}) : sessions?.sort(currentSessionFirst(session.id)).map((sa) => {
				if (!isSignedInStatus(sa.status)) return null;
				return /* @__PURE__ */ jsx(DeviceItem, { session: sa }, sa.id);
			})
		})
	});
};
const isSignedInStatus = (status) => {
	return ["active", "pending"].includes(status);
};
const DeviceItem = ({ session }) => {
	const isCurrent = useSession().session?.id === session.id;
	const status = useLoadingStatus();
	const revokeSession = useReverification(session.revoke.bind(session));
	const revoke = async () => {
		if (isCurrent || !session) return;
		status.setLoading();
		return revokeSession().catch((err) => handleError(err, [], status.setError)).finally(() => status.setIdle());
	};
	return /* @__PURE__ */ jsx(ProfileSection.Item, {
		id: "activeDevices",
		elementDescriptor: descriptors.activeDeviceListItem,
		elementId: isCurrent ? descriptors.activeDeviceListItem.setId("current") : void 0,
		sx: {
			alignItems: "flex-start",
			opacity: status.isLoading ? .5 : 1
		},
		isDisabled: status.isLoading,
		children: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DeviceInfo, { session }), !isCurrent && /* @__PURE__ */ jsx(ActiveDeviceMenu, { revoke })] })
	});
};
const DeviceInfo = (props) => {
	const { session } = useSession();
	const isCurrent = session?.id === props.session.id;
	const isCurrentlyImpersonating = !!session?.actor;
	const isImpersonationSession = !!props.session.actor;
	const { city, country, browserName, browserVersion, deviceType, ipAddress, isMobile } = props.session.latestActivity;
	const title = deviceType ? deviceType : isMobile ? "Mobile device" : "Desktop device";
	const browser = `${browserName || ""} ${browserVersion || ""}`.trim() || "Web browser";
	const location = [city || "", country || ""].filter(Boolean).join(", ").trim() || null;
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.activeDevice,
		elementId: isCurrent ? descriptors.activeDevice.setId("current") : void 0,
		sx: (t) => ({
			width: "100%",
			overflow: "hidden",
			gap: t.space.$4,
			[mqu.sm]: { gap: t.space.$2 }
		}),
		children: [/* @__PURE__ */ jsx(Flex, {
			sx: (theme) => ({
				[mqu.sm]: { padding: `0` },
				borderRadius: theme.radii.$md
			}),
			children: /* @__PURE__ */ jsx(Icon, {
				elementDescriptor: descriptors.activeDeviceIcon,
				elementId: descriptors.activeDeviceIcon.setId(isMobile ? "mobile" : "desktop"),
				icon: isMobile ? SvgDeviceMobile : SvgDeviceLaptop,
				sx: (theme) => ({
					"--cl-chassis-bottom": "#444444",
					"--cl-chassis-back": "#343434",
					"--cl-chassis-screen": "#575757",
					"--cl-screen": "#000000",
					width: theme.space.$8,
					height: theme.space.$8
				})
			})
		}), /* @__PURE__ */ jsxs(Col, {
			align: "start",
			gap: 1,
			children: [
				/* @__PURE__ */ jsxs(Flex, {
					center: true,
					gap: 2,
					children: [
						/* @__PURE__ */ jsx(Text, { children: title }),
						isCurrent && /* @__PURE__ */ jsx(Badge, {
							localizationKey: localizationKeys("badge__thisDevice"),
							colorScheme: isCurrentlyImpersonating ? "danger" : "primary"
						}),
						isCurrentlyImpersonating && !isImpersonationSession && /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__userDevice") }),
						!isCurrent && isImpersonationSession && /* @__PURE__ */ jsx(Badge, {
							localizationKey: localizationKeys("badge__otherImpersonatorDevice"),
							colorScheme: "danger"
						})
					]
				}),
				/* @__PURE__ */ jsx(Text, {
					colorScheme: "secondary",
					children: browser
				}),
				/* @__PURE__ */ jsxs(Text, {
					colorScheme: "secondary",
					children: [
						ipAddress,
						" (",
						location,
						")"
					]
				}),
				/* @__PURE__ */ jsx(Text, {
					colorScheme: "secondary",
					children: t(getRelativeToNowDateKey(props.session.lastActiveAt))
				})
			]
		})]
	});
};
const ActiveDeviceMenu = ({ revoke }) => {
	return /* @__PURE__ */ jsx(ThreeDotsMenu, { actions: [{
		label: localizationKeys("userProfile.start.activeDevicesSection.destructiveAction"),
		isDestructive: true,
		onClick: revoke
	}].filter((a) => a !== null) });
};

//#endregion
export { ActiveDevicesSection };
//# sourceMappingURL=ActiveDevicesSection.js.map