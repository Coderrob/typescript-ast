"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.someDescendant = someDescendant;
exports.findDescendant = findDescendant;
exports.someDescendantUntil = someDescendantUntil;
/**
 * Check if any descendant of node matches the predicate using visitor keys for traversal.
 */
function someDescendant(node, visitorKeys, predicate) {
    const keys = visitorKeys[node.type] ?? [];
    for (const key of keys) {
        const child = node[key];
        if (!child)
            continue;
        const children = Array.isArray(child) ? child : [child];
        for (const c of children) {
            if (c && typeof c === "object" && "type" in c) {
                const childNode = c;
                if (predicate(childNode) || someDescendant(childNode, visitorKeys, predicate)) {
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * Find the first descendant of node matching the predicate.
 */
function findDescendant(node, visitorKeys, predicate) {
    const keys = visitorKeys[node.type] ?? [];
    for (const key of keys) {
        const child = node[key];
        if (!child)
            continue;
        const children = Array.isArray(child) ? child : [child];
        for (const c of children) {
            if (c && typeof c === "object" && "type" in c) {
                const childNode = c;
                if (predicate(childNode))
                    return childNode;
                const found = findDescendant(childNode, visitorKeys, predicate);
                if (found)
                    return found;
            }
        }
    }
    return null;
}
/**
 * Search descendants until stop condition is met.
 */
function someDescendantUntil(node, visitorKeys, predicate, stopPredicate) {
    const keys = visitorKeys[node.type] ?? [];
    for (const key of keys) {
        const child = node[key];
        if (!child)
            continue;
        const children = Array.isArray(child) ? child : [child];
        for (const c of children) {
            if (c && typeof c === "object" && "type" in c) {
                const childNode = c;
                if (stopPredicate(childNode))
                    continue;
                if (predicate(childNode) || someDescendantUntil(childNode, visitorKeys, predicate, stopPredicate)) {
                    return true;
                }
            }
        }
    }
    return false;
}
//# sourceMappingURL=search.js.map