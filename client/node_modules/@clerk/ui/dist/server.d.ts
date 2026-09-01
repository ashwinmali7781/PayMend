import { Appearance } from "./internal/appearance.js";
import { Ui } from "./internal/index.js";

//#region src/server.d.ts
/**
 * UI object for React Server Components.
 *
 * ClerkUI is imported from a 'use client' module so that RSC serializes it as a
 * client reference. The bundler includes the actual ClerkUI code only in the
 * client bundle and resolves the reference automatically on hydration.
 *
 * @example
 * ```tsx
 * // app/layout.tsx (server component)
 * import { ClerkProvider } from '@clerk/nextjs';
 * import { ui } from '@clerk/ui';
 *
 * export default function Layout({ children }) {
 *   return <ClerkProvider ui={ui}>{children}</ClerkProvider>;
 * }
 * ```
 */
declare const ui: Ui<Appearance>;
//#endregion
export { ui };
//# sourceMappingURL=server.d.ts.map