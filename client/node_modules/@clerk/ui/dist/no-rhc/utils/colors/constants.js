//#region src/utils/colors/constants.ts
const COLOR_SCALE = [
	25,
	50,
	100,
	150,
	200,
	300,
	400,
	500,
	600,
	700,
	750,
	800,
	850,
	900,
	950
];
const LIGHT_SHADES = [
	"400",
	"300",
	"200",
	"150",
	"100",
	"50",
	"25"
];
const DARK_SHADES = [
	"600",
	"700",
	"750",
	"800",
	"850",
	"900",
	"950"
];
const ALL_SHADES = [
	...LIGHT_SHADES,
	"500",
	...DARK_SHADES
];
const LIGHTNESS_CONFIG = {
	TARGET_LIGHT: 97,
	TARGET_DARK: 12,
	LIGHT_STEPS: 7,
	DARK_STEPS: 7
};
const ALPHA_PERCENTAGES = {
	25: 2,
	50: 3,
	100: 7,
	150: 11,
	200: 15,
	300: 28,
	400: 41,
	500: 53,
	600: 62,
	700: 73,
	750: 78,
	800: 81,
	850: 84,
	900: 87,
	950: 92
};
const ALPHA_VALUES = Object.values(ALPHA_PERCENTAGES).map((v) => v / 100).sort();
const LIGHTNESS_MIX_DATA = {
	25: {
		mixColor: "white",
		percentage: 85
	},
	50: {
		mixColor: "white",
		percentage: 80
	},
	100: {
		mixColor: "white",
		percentage: 68
	},
	150: {
		mixColor: "white",
		percentage: 55
	},
	200: {
		mixColor: "white",
		percentage: 40
	},
	300: {
		mixColor: "white",
		percentage: 26
	},
	400: {
		mixColor: "white",
		percentage: 16
	},
	500: {
		mixColor: null,
		percentage: 0
	},
	600: {
		mixColor: "black",
		percentage: 12
	},
	700: {
		mixColor: "black",
		percentage: 22
	},
	750: {
		mixColor: "black",
		percentage: 30
	},
	800: {
		mixColor: "black",
		percentage: 44
	},
	850: {
		mixColor: "black",
		percentage: 55
	},
	900: {
		mixColor: "black",
		percentage: 65
	},
	950: {
		mixColor: "black",
		percentage: 75
	}
};
const RELATIVE_SHADE_STEPS = {
	400: 1,
	300: 2,
	200: 3,
	150: 4,
	100: 5,
	50: 6,
	25: 7,
	600: 1,
	700: 2,
	750: 3,
	800: 4,
	850: 5,
	900: 6,
	950: 7
};
const COLOR_BOUNDS = {
	rgb: {
		min: 0,
		max: 255
	},
	alpha: {
		min: 0,
		max: 1
	},
	hue: {
		min: 0,
		max: 360
	},
	percentage: {
		min: 0,
		max: 100
	}
};
const MODERN_CSS_LIMITS = {
	MAX_LIGHTNESS_MIX: 95,
	MIN_ALPHA_PERCENTAGE: 5,
	MAX_LIGHTNESS_ADJUSTMENT: 30,
	MIN_LIGHTNESS_FLOOR: 95,
	LIGHTNESS_MULTIPLIER: 2,
	MIX_MULTIPLIER: 4
};

//#endregion
export { ALL_SHADES, ALPHA_PERCENTAGES, ALPHA_VALUES, COLOR_BOUNDS, COLOR_SCALE, DARK_SHADES, LIGHTNESS_CONFIG, LIGHTNESS_MIX_DATA, LIGHT_SHADES, MODERN_CSS_LIMITS, RELATIVE_SHADE_STEPS };
//# sourceMappingURL=constants.js.map