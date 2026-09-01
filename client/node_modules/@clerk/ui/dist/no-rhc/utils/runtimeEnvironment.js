import { isDevelopmentEnvironment } from "@clerk/shared/utils";

//#region src/utils/runtimeEnvironment.ts
const isDevelopmentSDK = (clerk) => isDevelopmentEnvironment() || clerk.sdkMetadata?.environment === "development";

//#endregion
export { isDevelopmentSDK };
//# sourceMappingURL=runtimeEnvironment.js.map