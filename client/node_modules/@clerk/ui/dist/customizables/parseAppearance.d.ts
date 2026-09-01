import { Appearance, Theme } from "../internal/appearance.js";
//#region src/customizables/parseAppearance.d.ts
type PublicAppearanceTopLevelKey = Exclude<keyof Appearance, keyof Theme | 'captcha' | 'cssLayerName' | 'elements' | 'layout' | 'theme' | 'variables'>;
type AppearanceCascade = {
  globalAppearance?: Appearance;
  appearance?: Appearance;
  appearanceKey: PublicAppearanceTopLevelKey | 'impersonationFab' | 'enableOrganizationsPrompt';
};
//#endregion
export { AppearanceCascade };
//# sourceMappingURL=parseAppearance.d.ts.map