import { useRouter } from "../router/RouteContext.js";
import { Link } from "../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/RouterLink.tsx
const RouterLink = (props) => {
	const { to, onClick: onClickProp, ...rest } = props;
	const router = useRouter();
	const toUrl = router.resolve(to || router.indexPath);
	const onClick = (e) => {
		e.preventDefault();
		if (onClickProp && !to) return onClickProp(e);
		return router.navigate(toUrl.href);
	};
	return /* @__PURE__ */ jsx(Link, {
		...rest,
		onClick,
		href: toUrl.href
	});
};

//#endregion
export { RouterLink };
//# sourceMappingURL=RouterLink.js.map