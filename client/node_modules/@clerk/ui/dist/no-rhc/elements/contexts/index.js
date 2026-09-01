import { useRouter } from "../../router/RouteContext.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import React from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { FloatingTree, useFloatingParentNodeId } from "@floating-ui/react";

//#region src/elements/contexts/index.tsx
const [CardStateCtx, _useCardState] = createContextAndHook("CardState");
const CardStateProvider = (props) => {
	const { translateError } = useLocalizations();
	const router = useRouter();
	const [state, setState] = React.useState(() => ({
		status: "idle",
		metadata: void 0,
		error: translateError(window?.Clerk?.__internal_last_error || void 0)
	}));
	React.useEffect(() => {
		const error = window?.Clerk?.__internal_last_error;
		if (error) setState((s) => ({
			...s,
			error: translateError(error)
		}));
	}, [
		translateError,
		setState,
		router.currentPath
	]);
	const value = React.useMemo(() => ({ value: {
		state,
		setState
	} }), [state, setState]);
	return /* @__PURE__ */ jsx(CardStateCtx.Provider, {
		value,
		children: props.children
	});
};
const useCardState = () => {
	const { state, setState } = _useCardState();
	const { translateError } = useLocalizations();
	const setIdle = (metadata) => setState((s) => ({
		...s,
		status: "idle",
		metadata
	}));
	const setError = (metadata) => setState((s) => ({
		...s,
		error: translateError(metadata)
	}));
	const setLoading = (metadata) => setState((s) => ({
		...s,
		status: "loading",
		metadata
	}));
	const runAsync = async (cb, metadata) => {
		setLoading(metadata);
		return (typeof cb === "function" ? cb() : cb).then((res) => {
			return res;
		}).finally(() => setIdle(metadata));
	};
	return {
		setIdle,
		setError,
		setLoading,
		runAsync,
		loadingMetadata: state.status === "loading" ? state.metadata : void 0,
		error: state.error ? state.error : void 0,
		isLoading: state.status === "loading",
		isIdle: state.status === "idle",
		state
	};
};
const withCardStateProvider = (Component) => {
	return (props) => {
		return /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(Component, { ...props }) });
	};
};
const [FlowMetadataCtx, useFlowMetadata] = createContextAndHook("FlowMetadata");
const FlowMetadataProvider = (props) => {
	const { flow, part } = props;
	const value = React.useMemo(() => ({ value: props }), [flow, part]);
	return /* @__PURE__ */ jsx(FlowMetadataCtx.Provider, {
		value,
		children: props.children
	});
};
const withFloatingTree = (Component) => {
	return (props) => {
		if (useFloatingParentNodeId() == null) return /* @__PURE__ */ jsx(FloatingTree, { children: /* @__PURE__ */ jsx(Component, { ...props }) });
		return /* @__PURE__ */ jsx(Component, { ...props });
	};
};

//#endregion
export { CardStateProvider, FlowMetadataProvider, useCardState, useFlowMetadata, withCardStateProvider, withFloatingTree };
//# sourceMappingURL=index.js.map