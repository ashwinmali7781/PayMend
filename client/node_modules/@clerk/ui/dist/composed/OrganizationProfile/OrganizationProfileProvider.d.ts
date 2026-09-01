import { Appearance } from "../../internal/appearance.js";
import { PropsWithChildren, ReactNode } from "react";
import { OrganizationProfileProps } from "@clerk/shared/types";

//#region src/composed/OrganizationProfile/OrganizationProfileProvider.d.ts
type OrganizationProfileProviderProps = PropsWithChildren<{
  appearance?: Appearance;
  afterLeaveOrganizationUrl?: OrganizationProfileProps['afterLeaveOrganizationUrl'];
  apiKeysProps?: OrganizationProfileProps['apiKeysProps'];
}>;
declare const OrganizationProfileProvider: (props: OrganizationProfileProviderProps) => ReactNode;
//#endregion
export { OrganizationProfileProvider };
//# sourceMappingURL=OrganizationProfileProvider.d.ts.map