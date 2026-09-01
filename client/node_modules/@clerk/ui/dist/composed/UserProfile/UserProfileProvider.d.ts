import { Appearance } from "../../internal/appearance.js";
import { PropsWithChildren, ReactNode } from "react";
import { OAuthProvider, OAuthScope, UserProfileProps } from "@clerk/shared/types";

//#region src/composed/UserProfile/UserProfileProvider.d.ts
type UserProfileProviderProps = PropsWithChildren<{
  appearance?: Appearance;
  additionalOAuthScopes?: Partial<Record<OAuthProvider, OAuthScope[]>>;
  apiKeysProps?: UserProfileProps['apiKeysProps'];
}>;
declare const UserProfileProvider: (props: UserProfileProviderProps) => ReactNode;
//#endregion
export { UserProfileProvider };
//# sourceMappingURL=UserProfileProvider.d.ts.map