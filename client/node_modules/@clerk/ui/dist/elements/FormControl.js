import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { common } from "../styledSystem/common.js";
import { animations } from "../styledSystem/animations.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, FormErrorText, FormInfoText, FormSuccessText, FormWarningText, Span } from "../customizables/index.js";
import { useCallback, useMemo, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { titleize } from "@clerk/shared/underscore";

//#region src/elements/FormControl.tsx
function useFormTextAnimation() {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { animations: appearanceAnimations } = useAppearance().parsedOptions;
	return { getFormTextAnimation: useCallback((enterAnimation, options) => {
		if (prefersReducedMotion || !appearanceAnimations) return { animation: "none" };
		const inAnimation = options?.inDelay ? animations.inDelayAnimation : animations.inAnimation;
		return (t) => ({
			animation: `${enterAnimation ? inAnimation : animations.outAnimation} ${t.transitionDuration.$textField} ${t.transitionTiming.$common}`,
			transitionProperty: "height",
			transitionDuration: t.transitionDuration.$slow,
			transitionTimingFunction: t.transitionTiming.$common
		});
	}, [prefersReducedMotion, appearanceAnimations]) };
}
const useCalculateErrorTextHeight = ({ feedback }) => {
	const [height, setHeight] = useState(0);
	return {
		height,
		calculateHeight: useCallback((element) => {
			if (element) setHeight(element.scrollHeight + element.offsetTop * 2);
		}, [feedback])
	};
};
const FormFeedback = (props) => {
	const { id, elementDescriptors, sx, feedback, feedbackType = "info", center = false } = props;
	const feedbacksRef = useRef({
		a: void 0,
		b: void 0
	});
	const { getFormTextAnimation } = useFormTextAnimation();
	const defaultElementDescriptors = {
		error: descriptors.formFieldErrorText,
		warning: descriptors.formFieldWarningText,
		info: descriptors.formFieldInfoText,
		success: descriptors.formFieldSuccessText
	};
	const feedbacks = useMemo(() => {
		const oldFeedbacks = feedbacksRef.current;
		let result;
		if (oldFeedbacks.a?.shouldEnter) result = {
			a: {
				...oldFeedbacks.a,
				shouldEnter: false
			},
			b: {
				feedback,
				feedbackType,
				shouldEnter: true
			}
		};
		else result = {
			a: {
				feedback,
				feedbackType,
				shouldEnter: true
			},
			b: {
				...oldFeedbacks.b,
				shouldEnter: false
			}
		};
		feedbacksRef.current = result;
		return result;
	}, [feedback, feedbackType]);
	const { calculateHeight: calculateHeightA, height: heightA } = useCalculateErrorTextHeight({ feedback: feedbacks.a?.feedback || "" });
	const { calculateHeight: calculateHeightB, height: heightB } = useCalculateErrorTextHeight({ feedback: feedbacks.b?.feedback || "" });
	const maxHeightRef = useRef(Math.max(heightA, heightB));
	const maxHeight = useMemo(() => {
		const max = Math.max(heightA, heightB, maxHeightRef.current);
		maxHeightRef.current = max;
		return max;
	}, [heightA, heightB]);
	const getElementProps = (type) => {
		if (!type) return {};
		const descriptor = elementDescriptors?.[type] || defaultElementDescriptors[type];
		return {
			elementDescriptor: descriptor,
			elementId: id ? descriptor?.setId?.(id) : void 0,
			id: type === "error" ? `error-${id}` : `${id}-${type}-feedback`
		};
	};
	const FormInfoComponent = {
		error: FormErrorText,
		info: FormInfoText,
		success: FormSuccessText,
		warning: FormWarningText
	};
	const InfoComponentA = FormInfoComponent[feedbacks.a?.feedbackType || "info"];
	const InfoComponentB = FormInfoComponent[feedbacks.b?.feedbackType || "info"];
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Span, {
		"aria-live": "polite",
		"aria-atomic": "true",
		sx: { ...common.visuallyHidden() },
		children: feedback ? titleize(feedback) : ""
	}), /* @__PURE__ */ jsxs(Flex, {
		style: {
			height: feedback ? maxHeight : 0,
			position: "relative"
		},
		center,
		sx: [getFormTextAnimation(!!feedback), sx],
		children: [/* @__PURE__ */ jsx(InfoComponentA, {
			...getElementProps(feedbacks.a?.feedbackType),
			...feedbacks.a?.feedbackType && { "data-testid": `form-feedback-${feedbacks.a.feedbackType}` },
			ref: calculateHeightA,
			sx: [() => ({ visibility: feedbacks.a?.shouldEnter ? "visible" : "hidden" }), getFormTextAnimation(!!feedbacks.a?.shouldEnter, { inDelay: true })],
			localizationKey: titleize(feedbacks.a?.feedback)
		}), /* @__PURE__ */ jsx(InfoComponentB, {
			...getElementProps(feedbacks.b?.feedbackType),
			...feedbacks.b?.feedbackType && { "data-testid": `form-feedback-${feedbacks.b.feedbackType}` },
			ref: calculateHeightB,
			sx: [() => ({ visibility: feedbacks.b?.shouldEnter ? "visible" : "hidden" }), getFormTextAnimation(!!feedbacks.b?.shouldEnter, { inDelay: true })],
			localizationKey: titleize(feedbacks.b?.feedback)
		})]
	})] });
};

//#endregion
export { FormFeedback };
//# sourceMappingURL=FormControl.js.map