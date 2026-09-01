import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

//#region src/components/devPrompts/KeylessPrompt/use-drag-to-corner.ts
const STORAGE_KEY = "clerk-keyless-prompt-corner";
const CORNER_OFFSET = "1.25rem";
const CORNER_OFFSET_PX = 20;
const DRAG_THRESHOLD = 5;
const VELOCITY_SAMPLE_INTERVAL_MS = 10;
const INERTIA_DECELERATION_RATE = .999;
const SPRING_TRANSITION = `transform 350ms cubic-bezier(0.34, 1.2, 0.64, 1)`;
const ZERO_TRANSFORM = "translate3d(0px, 0px, 0)";
const ZERO_POINT = {
	x: 0,
	y: 0
};
function getNearestCorner(projectedTranslation, corners) {
	let nearestCorner = "bottom-right";
	let minDistance = Infinity;
	for (const [corner, translation] of Object.entries(corners)) {
		const dx = projectedTranslation.x - translation.x;
		const dy = projectedTranslation.y - translation.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < minDistance) {
			minDistance = distance;
			nearestCorner = corner;
		}
	}
	return nearestCorner;
}
function getCornerStyles(corner) {
	switch (corner) {
		case "top-left": return {
			top: CORNER_OFFSET,
			left: CORNER_OFFSET
		};
		case "top-right": return {
			top: CORNER_OFFSET,
			right: CORNER_OFFSET
		};
		case "bottom-left": return {
			bottom: CORNER_OFFSET,
			left: CORNER_OFFSET
		};
		case "bottom-right": return {
			bottom: CORNER_OFFSET,
			right: CORNER_OFFSET
		};
	}
}
const VALID_CORNERS = [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right"
];
function saveCornerPreference(corner) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, corner);
	} catch {}
}
function project(initialVelocity) {
	return initialVelocity / 1e3 * INERTIA_DECELERATION_RATE / (1 - INERTIA_DECELERATION_RATE);
}
function calculateVelocity(history) {
	if (history.length < 2) return ZERO_POINT;
	const oldest = history[0];
	const latest = history[history.length - 1];
	const timeDelta = latest.timestamp - oldest.timestamp;
	if (timeDelta === 0) return ZERO_POINT;
	return {
		x: (latest.position.x - oldest.position.x) / timeDelta * 1e3,
		y: (latest.position.y - oldest.position.y) / timeDelta * 1e3
	};
}
function useDragToCorner() {
	const [corner, setCorner] = useState("bottom-right");
	const [isDragging, setIsDragging] = useState(false);
	const [preventClick, setPreventClick] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const pendingCornerUpdate = useRef(null);
	useEffect(() => {
		if (typeof window === "undefined") {
			setIsInitialized(true);
			return;
		}
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored && VALID_CORNERS.includes(stored)) setCorner(stored);
		} catch {} finally {
			setIsInitialized(true);
		}
	}, []);
	const containerRef = useRef(null);
	const machine = useRef({ state: "idle" });
	const cleanup = useRef(null);
	const origin = useRef({
		x: 0,
		y: 0
	});
	const translation = useRef({
		x: 0,
		y: 0
	});
	const lastTimestamp = useRef(0);
	const velocities = useRef([]);
	const dragStartDimensions = useRef(null);
	const setTranslation = useCallback((position) => {
		if (!containerRef.current) return;
		translation.current = position;
		containerRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
	}, []);
	const getCorners = useCallback(() => {
		const container = containerRef.current;
		if (!container) return {
			"top-left": ZERO_POINT,
			"top-right": ZERO_POINT,
			"bottom-left": ZERO_POINT,
			"bottom-right": ZERO_POINT
		};
		const triggerWidth = dragStartDimensions.current?.width ?? container.offsetWidth ?? 0;
		const triggerHeight = dragStartDimensions.current?.height ?? container.offsetHeight ?? 0;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		function getAbsolutePosition(c) {
			const isRight = c.includes("right");
			const isBottom = c.includes("bottom");
			return {
				x: isRight ? window.innerWidth - scrollbarWidth - CORNER_OFFSET_PX - triggerWidth : CORNER_OFFSET_PX,
				y: isBottom ? window.innerHeight - CORNER_OFFSET_PX - triggerHeight : CORNER_OFFSET_PX
			};
		}
		const base = getAbsolutePosition(corner);
		function toRelative(c) {
			const pos = getAbsolutePosition(c);
			return {
				x: pos.x - base.x,
				y: pos.y - base.y
			};
		}
		return {
			"top-left": toRelative("top-left"),
			"top-right": toRelative("top-right"),
			"bottom-left": toRelative("bottom-left"),
			"bottom-right": toRelative("bottom-right")
		};
	}, [corner]);
	const animate = useCallback((cornerTranslation) => {
		const el = containerRef.current;
		if (!el) return;
		const dx = cornerTranslation.translation.x - translation.current.x;
		const dy = cornerTranslation.translation.y - translation.current.y;
		if (Math.sqrt(dx * dx + dy * dy) < .5) {
			saveCornerPreference(cornerTranslation.corner);
			translation.current = ZERO_POINT;
			el.style.transition = "";
			el.style.transform = ZERO_TRANSFORM;
			machine.current = { state: "idle" };
			setPreventClick(false);
			return;
		}
		const handleAnimationEnd = (e) => {
			if (e.propertyName !== "transform") return;
			el.removeEventListener("transitionend", handleAnimationEnd);
			saveCornerPreference(cornerTranslation.corner);
			if (cornerTranslation.corner === corner) {
				translation.current = ZERO_POINT;
				el.style.transition = "";
				el.style.transform = ZERO_TRANSFORM;
				machine.current = { state: "idle" };
				setPreventClick(false);
			} else {
				machine.current = { state: "animating" };
				pendingCornerUpdate.current = cornerTranslation.corner;
				setCorner(cornerTranslation.corner);
			}
		};
		el.style.transition = SPRING_TRANSITION;
		el.addEventListener("transitionend", handleAnimationEnd);
		setTranslation(cornerTranslation.translation);
	}, [setTranslation, corner]);
	const cancel = useCallback(() => {
		if (machine.current.state === "drag") {
			containerRef.current?.releasePointerCapture(machine.current.pointerId);
			machine.current = { state: "animating" };
		} else machine.current = { state: "idle" };
		if (cleanup.current) {
			cleanup.current();
			cleanup.current = null;
		}
		velocities.current = [];
		setIsDragging(false);
		dragStartDimensions.current = null;
		containerRef.current?.classList.remove("dev-tools-grabbing");
		document.body.style.removeProperty("user-select");
		document.body.style.removeProperty("-webkit-user-select");
	}, []);
	useLayoutEffect(() => {
		if (pendingCornerUpdate.current === corner) {
			const el = containerRef.current;
			if (el && machine.current.state === "animating") {
				translation.current = ZERO_POINT;
				el.style.transition = "";
				el.style.transform = ZERO_TRANSFORM;
				machine.current = { state: "idle" };
				setPreventClick(false);
				pendingCornerUpdate.current = null;
			}
		}
	}, [corner]);
	useLayoutEffect(() => {
		return () => {
			cancel();
		};
	}, [cancel]);
	const handlePointerDown = useCallback((e) => {
		const target = e.target;
		if (target.tagName === "A" || target.closest("a")) return;
		if (e.button !== 0) return;
		const container = containerRef.current;
		if (!container) return;
		dragStartDimensions.current = {
			width: container.offsetWidth,
			height: container.offsetHeight
		};
		origin.current = {
			x: e.clientX,
			y: e.clientY
		};
		const currentTransform = container.style.transform;
		if (currentTransform && currentTransform !== "none" && currentTransform !== ZERO_TRANSFORM) {
			const match = currentTransform.match(/translate3d\(([^,]+)px,\s*([^,]+)px/);
			if (match) translation.current = {
				x: parseFloat(match[1]) || 0,
				y: parseFloat(match[2]) || 0
			};
		} else translation.current = ZERO_POINT;
		machine.current = { state: "press" };
		velocities.current = [];
		lastTimestamp.current = Date.now();
		const handlePointerMove = (moveEvent) => {
			if (machine.current.state === "press") {
				const dx = moveEvent.clientX - origin.current.x;
				const dy = moveEvent.clientY - origin.current.y;
				if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
				machine.current = {
					state: "drag",
					pointerId: moveEvent.pointerId
				};
				try {
					container.setPointerCapture(moveEvent.pointerId);
				} catch {}
				container.style.transition = "none";
				container.classList.add("dev-tools-grabbing");
				document.body.style.userSelect = "none";
				document.body.style.webkitUserSelect = "none";
				setIsDragging(true);
				setTranslation({
					x: translation.current.x + dx,
					y: translation.current.y + dy
				});
				origin.current = {
					x: moveEvent.clientX,
					y: moveEvent.clientY
				};
				return;
			}
			if (machine.current.state !== "drag") return;
			const currentPosition = {
				x: moveEvent.clientX,
				y: moveEvent.clientY
			};
			const dx = currentPosition.x - origin.current.x;
			const dy = currentPosition.y - origin.current.y;
			origin.current = currentPosition;
			setTranslation({
				x: translation.current.x + dx,
				y: translation.current.y + dy
			});
			const now = Date.now();
			if (now - lastTimestamp.current >= VELOCITY_SAMPLE_INTERVAL_MS) {
				velocities.current = [...velocities.current.slice(-4), {
					position: currentPosition,
					timestamp: now
				}];
				lastTimestamp.current = now;
			}
		};
		const handlePointerUp = () => {
			if (machine.current.state === "drag") {
				const velocity = calculateVelocity(velocities.current);
				const allCorners = getCorners();
				cancel();
				if (!containerRef.current) return;
				const newCorner = getNearestCorner({
					x: translation.current.x + project(velocity.x),
					y: translation.current.y + project(velocity.y)
				}, allCorners);
				const targetTranslation = allCorners[newCorner];
				setPreventClick(true);
				animate({
					corner: newCorner,
					translation: targetTranslation
				});
			} else cancel();
		};
		const handleClick = (clickEvent) => {
			const target = clickEvent.target;
			const isButton = target.tagName === "BUTTON" || target.closest("button");
			const isLink = target.tagName === "A" || target.closest("a");
			if (machine.current.state === "animating" && !isButton && !isLink) {
				clickEvent.preventDefault();
				clickEvent.stopPropagation();
			}
		};
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp, { once: true });
		window.addEventListener("pointercancel", cancel, { once: true });
		container.addEventListener("click", handleClick);
		if (cleanup.current) cleanup.current();
		cleanup.current = () => {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
			window.removeEventListener("pointercancel", cancel);
			container.removeEventListener("click", handleClick);
		};
	}, [
		cancel,
		setTranslation,
		animate,
		getCorners
	]);
	return {
		corner,
		isDragging,
		cornerStyle: getCornerStyles(corner),
		containerRef,
		onPointerDown: handlePointerDown,
		preventClick,
		isInitialized
	};
}

//#endregion
export { useDragToCorner };
//# sourceMappingURL=use-drag-to-corner.js.map