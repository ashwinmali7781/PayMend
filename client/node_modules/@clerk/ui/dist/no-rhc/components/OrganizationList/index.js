import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { Flow } from "../../customizables/Flow.js";
import { OrganizationListPage } from "./OrganizationListPage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationList/index.tsx
const OrganizationListInternal = () => {
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "organizationList",
		children: /* @__PURE__ */ jsx(Flow.Part, { children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, { children: /* @__PURE__ */ jsx(AuthenticatedRoutes, {}) }) }) })
	});
};
const AuthenticatedRoutes = withCoreUserGuard(OrganizationListPage);
const OrganizationList = OrganizationListInternal;

//#endregion
export { OrganizationList };
//# sourceMappingURL=index.js.map