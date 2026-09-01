import { createContext, useContext } from "react";

//#region src/contexts/components/SubscriberType.ts
const DEFAUlT = "user";
const SubscriberTypeContext = createContext(DEFAUlT);
const useSubscriberTypeContext = () => useContext(SubscriberTypeContext) || DEFAUlT;
const useSubscriberTypeLocalizationRoot = () => {
	return useSubscriberTypeContext() === "user" ? "userProfile" : "organizationProfile";
};

//#endregion
export { SubscriberTypeContext, useSubscriberTypeContext, useSubscriberTypeLocalizationRoot };
//# sourceMappingURL=SubscriberType.js.map