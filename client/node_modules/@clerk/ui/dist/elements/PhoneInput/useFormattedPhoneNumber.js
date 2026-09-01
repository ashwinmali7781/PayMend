import { IsoToCountryMap } from "./countryCodeData.js";
import { extractDigits, formatPhoneNumber, parsePhoneString } from "../../utils/phoneUtils.js";
import React from "react";

//#region src/elements/PhoneInput/useFormattedPhoneNumber.ts
const format = (str, iso) => {
	if (!str) return "";
	const country = IsoToCountryMap.get(iso);
	return formatPhoneNumber(str, country?.pattern, country?.code);
};
const useFormattedPhoneNumber = (props) => {
	const [number, setNumber] = React.useState(() => {
		const { number } = parsePhoneString(props.initPhoneWithCode || "");
		return number;
	});
	const [iso, setIso] = React.useState(parsePhoneString(props.initPhoneWithCode || "").number ? parsePhoneString(props.initPhoneWithCode || "").iso : props.locationBasedCountryIso || "us");
	React.useEffect(() => {
		setNumber(extractDigits(number));
	}, [iso, number]);
	const numberWithCode = React.useMemo(() => {
		if (!number) return "";
		return "+" + extractDigits(`${IsoToCountryMap.get(iso)?.code || "1"}${number}`);
	}, [iso, number]);
	const formattedNumber = React.useMemo(() => {
		return format(number, iso);
	}, [iso, number]);
	return {
		setNumber,
		setIso,
		setNumberAndIso: React.useCallback((str) => {
			const { iso, number } = parsePhoneString(str);
			setNumber(number);
			setIso(iso);
		}, [iso, number]),
		iso,
		number,
		numberWithCode,
		formattedNumber
	};
};

//#endregion
export { useFormattedPhoneNumber };
//# sourceMappingURL=useFormattedPhoneNumber.js.map