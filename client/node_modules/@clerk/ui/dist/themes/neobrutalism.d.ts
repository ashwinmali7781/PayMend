import { BaseTheme, CaptchaAppearanceOptions, Elements, Options, Variables } from "../internal/appearance.js";
import { InternalTheme } from "../foundations/defaultFoundations.js";
//#region src/themes/neobrutalism.d.ts
declare const neobrutalism: {
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
export { neobrutalism };
//# sourceMappingURL=neobrutalism.d.ts.map