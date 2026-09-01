import { createTheme } from "./createTheme.js";
import { dark } from "./dark.js";

//#region src/themes/shadesOfPurple.ts
const shadesOfPurple = createTheme({
	name: "shadesOfPurple",
	theme: dark,
	variables: {
		colorBackground: "#3f3c77",
		colorPrimary: "#f8d80d",
		colorPrimaryForeground: "#38375f",
		colorInputForeground: "#a1fdfe",
		colorShimmer: "rgba(161,253,254,0.36)"
	}
});

//#endregion
export { shadesOfPurple };
//# sourceMappingURL=shadesOfPurple.js.map