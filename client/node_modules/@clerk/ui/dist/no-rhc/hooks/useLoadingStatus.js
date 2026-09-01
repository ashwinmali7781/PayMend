import { useSafeState } from "./useSafeState.js";

//#region src/hooks/useLoadingStatus.ts
const useLoadingStatus = (initialState) => {
	const [state, setState] = useSafeState({
		status: "idle",
		metadata: void 0,
		...initialState
	});
	return {
		status: state.status,
		setIdle: (metadata) => setState({
			status: "idle",
			metadata
		}),
		setError: (metadata) => setState({
			status: "error",
			metadata
		}),
		setLoading: (metadata) => setState({
			status: "loading",
			metadata
		}),
		loadingMetadata: state.status === "loading" ? state.metadata : void 0,
		isLoading: state.status === "loading",
		isIdle: state.status === "idle"
	};
};

//#endregion
export { useLoadingStatus };
//# sourceMappingURL=useLoadingStatus.js.map