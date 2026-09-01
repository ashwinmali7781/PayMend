import { ClerkComponents } from "./components.js";
import React, { Suspense, lazy } from "react";
import { deprecated } from "@clerk/shared/deprecated";
import { UNSAFE_PortalProvider } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/lazyModules/providers.tsx
const ClerkContextProvider = lazy(() => import("../contexts/index.js").then((m) => ({ default: m.ClerkContextProvider })));
const EnvironmentProvider = lazy(() => import("../contexts/index.js").then((m) => ({ default: m.EnvironmentProvider })));
const OptionsProvider = lazy(() => import("../contexts/index.js").then((m) => ({ default: m.OptionsProvider })));
const ModuleManagerProvider = lazy(() => import("../contexts/index.js").then((m) => ({ default: m.ModuleManagerProvider })));
const AppearanceProvider = lazy(() => import("../customizables/index.js").then((m) => ({ default: m.AppearanceProvider })));
const VirtualRouter = lazy(() => import("../router/index.js").then((m) => ({ default: m.VirtualRouter })));
const InternalThemeProvider = lazy(() => import("../styledSystem/index.js").then((m) => ({ default: m.InternalThemeProvider })));
const StyleCacheProvider = lazy(() => import("../styledSystem/StyleCacheProvider.js").then((m) => ({ default: m.StyleCacheProvider })));
const Portal = lazy(() => import("../portal/index.js").then((m) => ({ default: m.Portal })));
const VirtualBodyRootPortal = lazy(() => import("../portal/index.js").then((m) => ({ default: m.VirtualBodyRootPortal })));
const FlowMetadataProvider = lazy(() => import("../elements/contexts/index.js").then((m) => ({ default: m.FlowMetadataProvider })));
const Modal = lazy(() => import("../elements/Modal.js").then((m) => ({ default: m.Modal })));
const DrawerRoot = lazy(() => import("../elements/Drawer.js").then((m) => ({ default: m.Drawer.Root })));
const DrawerOverlay = lazy(() => import("../elements/Drawer.js").then((m) => ({ default: m.Drawer.Overlay })));
const OrganizationSwitcherPrefetch = lazy(() => import(
	/* webpackChunkName: "prefetchorganizationlist" */
	"../components/prefetch-organization-list.js"
).then((m) => ({ default: m.OrganizationSwitcherPrefetch })));
const LazyProviders = (props) => {
	return /* @__PURE__ */ jsx(StyleCacheProvider, {
		nonce: props.options.nonce,
		cssLayerName: props.options.appearance?.cssLayerName,
		children: /* @__PURE__ */ jsx(ModuleManagerProvider, {
			moduleManager: props.moduleManager,
			children: /* @__PURE__ */ jsx(ClerkContextProvider, {
				clerk: props.clerk,
				children: /* @__PURE__ */ jsx(EnvironmentProvider, {
					value: props.environment,
					children: /* @__PURE__ */ jsx(OptionsProvider, {
						value: props.options,
						children: props.children
					})
				})
			})
		})
	});
};
const LazyComponentRenderer = (props) => {
	if (props?.componentProps?.routing === "virtual") deprecated("routing=\"virtual\"", "Use routing=\"hash\" instead.");
	return /* @__PURE__ */ jsx(AppearanceProvider, {
		globalAppearance: props.globalAppearance,
		appearanceKey: props.appearanceKey,
		appearance: props.componentAppearance,
		children: /* @__PURE__ */ jsx(UNSAFE_PortalProvider, {
			getContainer: props?.componentProps?.getContainer,
			children: /* @__PURE__ */ jsx(Portal, {
				node: props.node,
				component: ClerkComponents[props.componentName],
				props: props.componentProps,
				componentName: props.componentName
			})
		})
	});
};
const LazyModalRenderer = (props) => {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: "",
		children: /* @__PURE__ */ jsx(AppearanceProvider, {
			globalAppearance: props.globalAppearance,
			appearanceKey: props.appearanceKey,
			appearance: props.componentAppearance,
			children: /* @__PURE__ */ jsx(FlowMetadataProvider, {
				flow: props.flowName || "",
				children: /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(UNSAFE_PortalProvider, {
					getContainer: props.getContainer,
					children: /* @__PURE__ */ jsx(Modal, {
						id: props.modalId,
						style: props.modalStyle,
						handleClose: props.onClose,
						containerSx: props.modalContainerSx,
						contentSx: props.modalContentSx,
						canCloseModal: props.canCloseModal,
						children: props.startPath ? /* @__PURE__ */ jsx(Suspense, { children: /* @__PURE__ */ jsx(VirtualRouter, {
							startPath: props.startPath,
							onExternalNavigate: props.onExternalNavigate,
							children: props.children
						}) }) : props.children
					})
				}) })
			})
		})
	});
};
const LazyDrawerRenderer = (props) => {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: "",
		children: /* @__PURE__ */ jsx(VirtualRouter, {
			startPath: "",
			children: /* @__PURE__ */ jsx(AppearanceProvider, {
				globalAppearance: props.globalAppearance,
				appearanceKey: props.appearanceKey,
				appearance: props.componentAppearance,
				children: /* @__PURE__ */ jsx(FlowMetadataProvider, {
					flow: props.flowName || "",
					children: /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsxs(DrawerRoot, {
						open: props.open,
						onOpenChange: props.onOpenChange,
						strategy: props.portalId || props.portalRoot ? "absolute" : "fixed",
						portalProps: {
							id: props.portalId ? props.portalId : void 0,
							root: props.portalRoot ? props.portalRoot : void 0
						},
						children: [/* @__PURE__ */ jsx(DrawerOverlay, {}), props.children]
					}) })
				})
			})
		})
	});
};
/**
* This component automatically mounts when impersonating, without a user action.
* We want to hotload the /ui dependencies only if we're actually impersonating.
*/
const LazyImpersonationFabProvider = (props) => {
	return /* @__PURE__ */ jsx(Suspense, { children: /* @__PURE__ */ jsx(VirtualRouter, {
		startPath: "",
		children: /* @__PURE__ */ jsx(AppearanceProvider, {
			globalAppearance: props.globalAppearance,
			appearanceKey: "impersonationFab",
			children: props.children
		})
	}) });
};
const LazyEnableOrganizationsPromptProvider = (props) => {
	return /* @__PURE__ */ jsx(Suspense, { children: /* @__PURE__ */ jsx(VirtualRouter, {
		startPath: "",
		children: /* @__PURE__ */ jsx(AppearanceProvider, {
			globalAppearance: props.globalAppearance,
			appearanceKey: "enableOrganizationsPrompt",
			children: props.children
		})
	}) });
};
const LazyOneTapRenderer = (props) => {
	return /* @__PURE__ */ jsx(AppearanceProvider, {
		globalAppearance: props.globalAppearance,
		appearanceKey: "oneTap",
		appearance: props.componentAppearance,
		children: /* @__PURE__ */ jsx(VirtualBodyRootPortal, {
			startPath: props.startPath,
			component: ClerkComponents["GoogleOneTap"],
			props: props.componentProps,
			componentName: "GoogleOneTap"
		})
	});
};

//#endregion
export { LazyComponentRenderer, LazyDrawerRenderer, LazyEnableOrganizationsPromptProvider, LazyImpersonationFabProvider, LazyModalRenderer, LazyOneTapRenderer, LazyProviders, OrganizationSwitcherPrefetch };
//# sourceMappingURL=providers.js.map