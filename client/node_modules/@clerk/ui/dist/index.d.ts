import { Appearance } from "./internal/appearance.js";
import { Ui } from "./internal/index.js";

//#region src/index.d.ts
/**
 * UI object for Clerk UI components.
 * Pass this to ClerkProvider to use the bundled UI.
 *
 * @example
 * ```tsx
 * import { ui } from '@clerk/ui';
 *
 * <ClerkProvider ui={ui}>
 *   ...
 * </ClerkProvider>
 * ```
 */
declare const ui: Ui<Appearance>;
//#endregion
export { type Appearance, ui };
//# sourceMappingURL=index.d.ts.map