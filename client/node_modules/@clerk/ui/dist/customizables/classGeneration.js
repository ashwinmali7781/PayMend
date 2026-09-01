//#region src/customizables/classGeneration.ts
const STATE_PROP_TO_CLASSNAME = Object.freeze({
	loading: ` ${"cl-"}loading`,
	error: ` ${"cl-"}error`,
	open: ` ${"cl-"}open`,
	active: ` ${"cl-"}active`
});
const STATE_PROP_TO_SPECIFICITY = Object.freeze({
	loading: 2,
	error: 2,
	open: 2,
	active: 2
});
const generateClassName = (parsedElements, elemDescriptors, elemId, props) => {
	const state = getElementState(props);
	let className = "";
	const css = [];
	className = addClerkTargettableClassname(className, elemDescriptors);
	className = addClerkTargettableIdClassname(className, elemDescriptors, elemId);
	className = addClerkTargettableStateClass(className, state);
	className = addClerkTargettableRequiredAttribute(className, props);
	className = addUserProvidedClassnames(className, parsedElements, elemDescriptors, elemId, state);
	addUserProvidedStyleRules(css, parsedElements, elemDescriptors, elemId, state);
	return {
		className,
		css
	};
};
const addClerkTargettableClassname = (cn, elemDescriptors) => {
	for (let i = elemDescriptors.length - 1; i >= 0; i--) cn += elemDescriptors[i].targettableClassname + " ";
	return cn.trimEnd();
};
const addClerkTargettableIdClassname = (cn, elemDescriptors, elemId) => {
	if (!elemId) return cn;
	for (let i = elemDescriptors.length - 1; i >= 0; i--) cn = cn + " " + elemDescriptors[i].getTargettableIdClassname(elemId);
	return cn;
};
const addClerkTargettableStateClass = (cn, state) => {
	return state ? cn + STATE_PROP_TO_CLASSNAME[state] : cn;
};
const addClerkTargettableRequiredAttribute = (cn, props) => {
	return props && props.isRequired ? cn + ` ${"cl-"}required` : cn;
};
const appendEmojiSeparator = (generatedCn, otherCn) => {
	return generatedCn + (otherCn ? " " + otherCn : "") + " 🔒️";
};
const addUserProvidedStyleRules = (css, parsedElements, elemDescriptors, elemId, state) => {
	for (let j = 0; j < elemDescriptors.length; j++) for (let i = 0; i < parsedElements.length; i++) addRulesFromElements(css, parsedElements[i], elemDescriptors[j], elemId, state);
};
const addUserProvidedClassnames = (cn, parsedElements, elemDescriptors, elemId, state) => {
	for (let j = 0; j < elemDescriptors.length; j++) for (let i = 0; i < parsedElements.length; i++) cn = addClassnamesFromElements(cn, parsedElements[i], elemDescriptors[j], elemId, state);
	return cn;
};
const getElementState = (props) => {
	if (!props) return;
	if (props.isLoading) return "loading";
	if (props.hasError) return "error";
	if (props.isOpen) return "open";
	if (props.isActive) return "active";
};
const addStringClassname = (cn, val) => typeof val === "string" ? cn + " " + val : cn;
const addStyleRuleObject = (css, val, specificity = 0) => {
	if (specificity) {
		if (val && typeof val === "object") css.push({ ["&".repeat(specificity)]: val });
	} else if (val && typeof val === "object") css.push(val);
};
const generateFlowClassname = (props) => {
	return "cl-" + props.flow + "-root";
};
const generateFlowPartClassname = (props) => {
	if (!props.part) return "";
	return "cl-" + props.flow + "-" + props.part;
};
const addClassnamesFromElements = (cn, elements, elemDescriptor, elemId, state) => {
	if (!elements) return cn;
	cn = addStringClassname(cn, elements[elemDescriptor.objectKey]);
	if (elemId) cn = addStringClassname(cn, elements[elemDescriptor.getObjectKeyWithId(elemId)]);
	if (state) cn = addStringClassname(cn, elements[elemDescriptor.getObjectKeyWithState(state)]);
	if (elemId && state) cn = addStringClassname(cn, elements[elemDescriptor.getObjectKeyWithIdAndState(elemId, state)]);
	return cn;
};
const addRulesFromElements = (css, elements, elemDescriptor, elemId, state) => {
	if (!elements) return;
	addStyleRuleObject(css, elements[elemDescriptor.objectKey]);
	if (elemId) addStyleRuleObject(css, elements[elemDescriptor.getObjectKeyWithId(elemId)]);
	if (state) addStyleRuleObject(css, elements[elemDescriptor.getObjectKeyWithState(state)], STATE_PROP_TO_SPECIFICITY[state]);
	if (elemId && state) addStyleRuleObject(css, elements[elemDescriptor.getObjectKeyWithIdAndState(elemId, state)], STATE_PROP_TO_SPECIFICITY[state]);
};

//#endregion
export { appendEmojiSeparator, generateClassName, generateFlowClassname, generateFlowPartClassname };
//# sourceMappingURL=classGeneration.js.map