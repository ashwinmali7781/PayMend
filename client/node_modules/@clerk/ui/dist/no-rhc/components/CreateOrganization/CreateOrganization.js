import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { CreateOrganizationContext } from "../../contexts/components/CreateOrganization.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { CreateOrganizationPage } from "./CreateOrganizationPage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/CreateOrganization/CreateOrganization.tsx
const CreateOrganizationInternal = () => {
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "createOrganization",
		children: /* @__PURE__ */ jsx(Flow.Part, { children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, { children: /* @__PURE__ */ jsx(AuthenticatedRoutes, {}) }) }) })
	});
};
const AuthenticatedRoutes = withCoreUserGuard(() => {
	return /* @__PURE__ */ jsx(CreateOrganizationPage, {});
});
const CreateOrganization = withCardStateProvider(CreateOrganizationInternal);
const CreateOrganizationModal = (props) => {
	const createOrganizationProps = {
		...props,
		routing: "virtual",
		componentName: "CreateOrganization",
		mode: "modal"
	};
	return /* @__PURE__ */ jsx(Route, {
		path: "createOrganization",
		children: /* @__PURE__ */ jsx(CreateOrganizationContext.Provider, {
			value: createOrganizationProps,
			children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(CreateOrganization, {}) })
		})
	});
};

//#endregion
export { CreateOrganization, CreateOrganizationModal };
//# sourceMappingURL=CreateOrganization.js.map