import { BaseTheme, CaptchaAppearanceOptions, Elements, Options, Variables } from "../internal/appearance.js";
import { InternalTheme } from "../foundations/defaultFoundations.js";
//#region src/themes/dark.d.ts
declare const dark: {
  __type: "prebuilt_appearance";
  name?: string;
  elements?: Elements | ((params: {
    theme: InternalTheme;
  }) => Elements);
  theme?: (BaseTheme | BaseTheme[]) | undefined;
  options?: Options | undefined;
  variables?: Variables | undefined;
  captcha?: CaptchaAppearanceOptions | undefined;
  cssLayerName?: string | undefined;
};
//#endregion
export { dark };
//# sourceMappingURL=dark.d.ts.map