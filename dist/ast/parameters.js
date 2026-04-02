"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParameterTypeAnnotation = getParameterTypeAnnotation;
exports.getParameterTypeNode = getParameterTypeNode;
exports.getObjectDestructuredParameterTypeNode = getObjectDestructuredParameterTypeNode;
exports.getFirstNonThisParameter = getFirstNonThisParameter;
exports.isThisParameter = isThisParameter;
exports.getTsParameterPropertyIdentifier = getTsParameterPropertyIdentifier;
const nodes_1 = require("../guards/nodes");
/**
 * Get the TSTypeAnnotation from a function parameter.
 */
function getParameterTypeAnnotation(param) {
    if ("typeAnnotation" in param && param.typeAnnotation) {
        if ((0, nodes_1.isTSTypeAnnotation)(param.typeAnnotation))
            return param.typeAnnotation;
    }
    return null;
}
/**
 * Get the type node from a parameter's type annotation.
 */
function getParameterTypeNode(param) {
    const annotation = getParameterTypeAnnotation(param);
    return annotation?.typeAnnotation ?? null;
}
/**
 * Get the type node from a destructured (ObjectPattern) parameter.
 */
function getObjectDestructuredParameterTypeNode(param) {
    if (param.type !== "ObjectPattern")
        return null;
    return getParameterTypeNode(param);
}
/**
 * Get the first parameter that is not a 'this' keyword parameter.
 */
function getFirstNonThisParameter(params) {
    return params.find((p) => !isThisParameter(p)) ?? null;
}
/**
 * Check if a parameter is a 'this' keyword parameter.
 */
function isThisParameter(param) {
    return (0, nodes_1.isIdentifier)(param) && param.name === "this";
}
/**
 * Get the identifier from a TSParameterProperty.
 */
function getTsParameterPropertyIdentifier(param) {
    if (!(0, nodes_1.isTSParameterProperty)(param))
        return null;
    if ((0, nodes_1.isIdentifier)(param.parameter))
        return param.parameter;
    return null;
}
//# sourceMappingURL=parameters.js.map