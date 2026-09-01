import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { useFetch } from "../../hooks/useFetch.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Flex, Spinner } from "../../customizables/index.js";
import { RemoveResourceForm } from "../../common/RemoveResourceForm.js";
import React from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/RemoveDomainForm.tsx
const RemoveDomainForm = (props) => {
	const { organizationSettings } = useEnvironment();
	const { organization } = useOrganization();
	const { domainId: id, onSuccess, onReset } = props;
	const ref = React.useRef();
	const { data: domain, isLoading: domainIsLoading } = useFetch(organization?.getDomain, { domainId: id }, { onSuccess(domain) {
		ref.current = { ...domain };
	} });
	const { domains } = useOrganization({ domains: { infinite: true } });
	if (!organization || !organizationSettings) return null;
	if (domainIsLoading || !domain) return /* @__PURE__ */ jsx(Flex, {
		direction: "row",
		align: "center",
		justify: "center",
		children: /* @__PURE__ */ jsx(Spinner, {
			size: "lg",
			colorScheme: "primary",
			elementDescriptor: descriptors.spinner
		})
	});
	return /* @__PURE__ */ jsx(RemoveResourceForm, {
		title: localizationKeys("organizationProfile.removeDomainPage.title"),
		messageLine1: localizationKeys("organizationProfile.removeDomainPage.messageLine1", { domain: ref.current?.name || "" }),
		messageLine2: localizationKeys("organizationProfile.removeDomainPage.messageLine2"),
		deleteResource: () => domain?.delete().then(async () => {
			await domains?.revalidate?.();
			onSuccess();
		}),
		onSuccess,
		onReset
	});
};

//#endregion
export { RemoveDomainForm };
//# sourceMappingURL=RemoveDomainForm.js.map