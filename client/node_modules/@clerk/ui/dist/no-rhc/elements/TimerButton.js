import { useLocalizations } from "../localization/makeLocalizable.js";
import { Button } from "../customizables/index.js";
import React, { useEffect } from "react";
import { useSafeLayoutEffect } from "@clerk/shared/react";
import { jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/TimerButton.tsx
const TimerButton = (props) => {
	const { t } = useLocalizations();
	const { onClick: onClickProp, throttleTimeInSec = 30, startDisabled, children, localizationKey, showCounter = true, ...rest } = props;
	const [remainingSeconds, setRemainingSeconds] = React.useState(0);
	const intervalIdRef = React.useRef(void 0);
	useSafeLayoutEffect(() => {
		if (startDisabled) disable();
	}, []);
	useEffect(() => {
		return () => clearInterval(intervalIdRef.current);
	}, []);
	const disable = () => {
		setRemainingSeconds(throttleTimeInSec);
		intervalIdRef.current = window.setInterval(() => {
			setRemainingSeconds((seconds) => {
				if (seconds === 1) clearInterval(intervalIdRef.current);
				return seconds - 1;
			});
		}, 1e3);
	};
	const handleOnClick = (e) => {
		if (remainingSeconds) return;
		onClickProp?.(e);
		disable();
	};
	return /* @__PURE__ */ jsxs(Button, {
		variant: "link",
		...rest,
		textVariant: "buttonSmall",
		isDisabled: remainingSeconds > 0 || props.isDisabled,
		onClick: handleOnClick,
		children: [t(localizationKey) || children, remainingSeconds && showCounter ? ` (${remainingSeconds})` : ""]
	});
};

//#endregion
export { TimerButton };
//# sourceMappingURL=TimerButton.js.map