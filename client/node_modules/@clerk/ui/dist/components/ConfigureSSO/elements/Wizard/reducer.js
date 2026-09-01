//#region src/components/ConfigureSSO/elements/Wizard/reducer.ts
/**
* Resolve a step's inline reachability predicate. An omitted `isReachable`
* defaults TRUE — "no precondition" (the entry step), not "blocked".
*/
const isStepReachable = (step) => step.isReachable ? step.isReachable() : true;
const indexOf = (steps, id) => steps.findIndex((s) => s.id === id);
/**
* Where the wizard mounts on (re)load, derived purely from the graph + reachability:
* the FURTHEST step reachable by a contiguous run of holding entry predicates from
* the first step. Walk forward while the *next* step's predicate holds; stop at the
* first gate. With monotonic predicates this lands on the deepest step the user has
* unlocked. Degenerate-safe: an empty graph yields an empty `current`.
*/
const initialState = (config) => {
	const steps = config.descriptors;
	if (steps.length === 0) return {
		current: "",
		direction: 0,
		hasNavigated: false
	};
	let i = 0;
	while (i + 1 < steps.length && isStepReachable(steps[i + 1])) i++;
	return {
		current: steps[i].id,
		direction: 0,
		hasNavigated: false
	};
};
const advance = (next, direction) => ({
	current: next,
	direction,
	hasNavigated: true
});
/**
* Reduce a single event into the next {@link WizardState}.
*
* Pure: identical (state, event, config) always yields the same result. EVERY
* no-op path returns the IDENTICAL `state` object (`=== state`) — React's
* state-bail and the React seam's terminal/blocked fall-through detection both
* depend on referential identity. A guard-blocked or out-of-bounds transition
* is a true no-op (same ref), never a silent re-seat.
*
* Navigation is positional and sequential: NEXT/PREV move exactly one slot;
* there is no skip-satisfied walk and no visited history.
*/
const reduce = (state, event, config) => {
	const steps = config.descriptors;
	switch (event.type) {
		case "NEXT": {
			const i = indexOf(steps, state.current);
			if (i < 0) return state;
			const next = steps[i + 1];
			if (!next) return state;
			if (!isStepReachable(next)) return state;
			return advance(next.id, 1);
		}
		case "PREV": {
			const i = indexOf(steps, state.current);
			if (i < 0) return state;
			const prev = steps[i - 1];
			if (!prev) return state;
			if (!isStepReachable(prev)) return state;
			return advance(prev.id, -1);
		}
		case "GOTO": {
			const target = steps.find((s) => s.id === event.step);
			if (!target || target.id === state.current) return state;
			if (!isStepReachable(target)) return state;
			return advance(target.id, 0);
		}
		default: return state;
	}
};

//#endregion
export { initialState, isStepReachable, reduce };
//# sourceMappingURL=reducer.js.map