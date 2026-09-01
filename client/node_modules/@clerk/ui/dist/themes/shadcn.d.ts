import { BaseTheme, CaptchaAppearanceOptions, Elements, Options, Variables } from "../internal/appearance.js";
import { InternalTheme } from "../foundations/defaultFoundations.js";
//#region src/themes/shadcn.d.ts
declare const shadcn: {
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
export { shadcn };
//# sourceMappingURL=shadcn.d.ts.map