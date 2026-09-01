import { initialState, isStepReachable, reduce } from "./reducer.js";
import React from "react";

//#region src/components/ConfigureSSO/elements/Wizard/useWizardMachine.ts
/**
* Resolve the seed step: honor an explicit `preferred` id (nested resume) only
* when it names a real descriptor whose entry guard holds; otherwise fall back
* to the guard-derived furthest-reachable initial step. Guards against an
* invalid `initialStepId` seeding the machine onto a step that isn't in the
* graph (which would dead-lock NEXT/PREV with no clamp to recover).
*/
const resolveInitial = (cfg, preferred) => {
	if (preferred) {
		const target = cfg.descriptors.find((d) => d.id === preferred);
		if (target && isStepReachable(target)) return {
			current: preferred,
			direction: 0,
			hasNavigated: false
		};
	}
	return initialState(cfg);
};
/**
* Domain-agnostic wizard state machine. `reducer.ts` is the pure
* `(state, event, config) => state`; this hook is the React seam that owns the
* live state and reduces against the current config at dispatch time.
*
* Navigation is sequential and entry-guard-gated: `goNext`/`goPrev` advances one
* slot when the target's guard holds. A guard-blocked mid-flow `goNext` does NOT
* hard-stop — it DEFERS: the call parks a pending forward advance (see
* `pendingNextFrom`) that the render-phase resolver completes once the next
* guard becomes satisfied while still on this step (an explicit `goPrev`/
* `goToStep` abandons it). A guard-blocked mid-flow `goPrev` is still a HARD STOP
* (true no-op, never a bubble). Bubbling to `parentWizard` happens ONLY from a
* scope boundary — terminal position for `goNext`, first for `goPrev` — which is
* how a nested sub-flow's last step advances the parent. A top-level wizard
* treats a boundary nav as a no-op.
*
* `configRef`/`stateRef` are mirrored during render (not a `useEffect`) so the
* stable `dispatch` always sees the freshest config/state. The parent
* fall-through runs in the handler body, NEVER inside a `setState` updater:
* calling the parent's `setState` from a child updater triggers React's "cannot
* update a component while rendering a different component" warning.
*/
const useWizardMachine = ({ config, parentWizard, initialStepId }) => {
	const isNested = parentWizard !== null;
	const [state, setState] = React.useState(() => resolveInitial(config, initialStepId));
	const [pendingNextFrom, setPendingNextFrom] = React.useState(null);
	const configRef = React.useRef(config);
	configRef.current = config;
	const parentRef = React.useRef(parentWizard);
	parentRef.current = parentWizard;
	const stateRef = React.useRef(state);
	stateRef.current = state;
	const currentDescriptor = config.descriptors.find((d) => d.id === state.current);
	if (!currentDescriptor || !isStepReachable(currentDescriptor)) {
		const seated = initialState(config);
		if (seated.current !== state.current) setState(seated);
	}
	if (pendingNextFrom !== null) if (pendingNextFrom !== state.current) setPendingNextFrom(null);
	else {
		const advanced = reduce(state, { type: "NEXT" }, config);
		if (advanced !== state) {
			setState(advanced);
			setPendingNextFrom(null);
		}
	}
	const indexOfCurrent = (s, cfg) => cfg.descriptors.findIndex((d) => d.id === s.current);
	const goNext = React.useCallback(() => {
		const prev = stateRef.current;
		const cfg = configRef.current;
		const next = reduce(prev, { type: "NEXT" }, cfg);
		if (next !== prev) {
			setPendingNextFrom(null);
			setState(next);
			return;
		}
		if (indexOfCurrent(prev, cfg) === cfg.descriptors.length - 1) {
			parentRef.current?.goNext();
			return;
		}
		setPendingNextFrom(prev.current);
	}, []);
	const goPrev = React.useCallback(() => {
		setPendingNextFrom(null);
		const prev = stateRef.current;
		const cfg = configRef.current;
		const next = reduce(prev, { type: "PREV" }, cfg);
		if (next === prev) {
			if (indexOfCurrent(prev, cfg) === 0) parentRef.current?.goPrev();
			return;
		}
		setState(next);
	}, []);
	const dispatch = React.useCallback((event) => {
		const prev = stateRef.current;
		setState(reduce(prev, event, configRef.current));
	}, []);
	const goToStep = React.useCallback((id) => {
		setPendingNextFrom(null);
		dispatch({
			type: "GOTO",
			step: id
		});
	}, [dispatch]);
	const current = state.current;
	const activeSteps = React.useMemo(() => {
		const descriptors = config.descriptors;
		const currentDescriptorIndex = descriptors.findIndex((s) => s.id === current);
		return descriptors.map((s, descriptorIndex) => ({
			id: s.id,
			label: s.label,
			isCompleted: s.isComplete ? s.isComplete() : currentDescriptorIndex >= 0 && descriptorIndex < currentDescriptorIndex,
			isReachable: isStepReachable(s)
		}));
	}, [config, current]);
	const currentIndex = activeSteps.findIndex((s) => s.id === current);
	const currentStep = currentIndex >= 0 ? activeSteps[currentIndex] : void 0;
	const navigable = config.descriptors;
	const navIndex = navigable.findIndex((s) => s.id === current);
	const isInitialStep = !state.hasNavigated;
	return React.useMemo(() => ({
		current,
		direction: state.direction,
		activeSteps,
		currentStep,
		currentIndex,
		totalSteps: activeSteps.length,
		isInitialStep,
		isNested,
		isFirstStep: navIndex <= 0 && (!parentWizard || parentWizard.isFirstStep),
		isLastStep: navIndex === navigable.length - 1 && (!parentWizard || parentWizard.isLastStep),
		goNext,
		goPrev,
		goToStep
	}), [
		current,
		state.direction,
		activeSteps,
		currentStep,
		currentIndex,
		isInitialStep,
		isNested,
		navIndex,
		navigable.length,
		parentWizard,
		goNext,
		goPrev,
		goToStep
	]);
};

//#endregion
export { useWizardMachine };
//# sourceMappingURL=useWizardMachine.js.map