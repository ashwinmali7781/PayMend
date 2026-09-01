import { lazy } from "react";

//#region src/lazyModules/drawers.tsx
const MountedCheckoutDrawer = lazy(() => import("./MountedCheckoutDrawer.js").then((module) => ({ default: module.MountedCheckoutDrawer })));
const MountedPlanDetailDrawer = lazy(() => import("./MountedPlanDetailDrawer.js").then((module) => ({ default: module.MountedPlanDetailDrawer })));
const MountedSubscriptionDetailDrawer = lazy(() => import("./MountedSubscriptionDetailDrawer.js").then((module) => ({ default: module.MountedSubscriptionDetailDrawer })));

//#endregion
export { MountedCheckoutDrawer, MountedPlanDetailDrawer, MountedSubscriptionDetailDrawer };
//# sourceMappingURL=drawers.js.map