import { Cardinality, ExpressionKind } from "edgedb/dist/reflection/index.js";
import { jsonifyComplexParams } from "./json.mjs";
import { select } from "./select.mjs";
const runnableExpressionKinds = new Set([
    ExpressionKind.Select,
    ExpressionKind.Update,
    ExpressionKind.Insert,
    ExpressionKind.InsertUnlessConflict,
    ExpressionKind.Delete,
    ExpressionKind.Group,
    ExpressionKind.For,
    ExpressionKind.With,
    ExpressionKind.WithParams,
]);
const wrappedExprCache = new WeakMap();
export async function $queryFunc(cxn, args) {
    var _a;
    const expr = runnableExpressionKinds.has(this.__kind__)
        ? this
        : (_a = wrappedExprCache.get(this)) !== null && _a !== void 0 ? _a : wrappedExprCache.set(this, select(this)).get(this);
    const _args = jsonifyComplexParams(expr, args);
    const query = expr.toEdgeQL();
    if (expr.__cardinality__ === Cardinality.One ||
        expr.__cardinality__ === Cardinality.AtMostOne) {
        return cxn.querySingle(query, _args);
    }
    else {
        return cxn.query(query, _args);
    }
}
export async function $queryFuncJSON(cxn, args) {
    var _a;
    const expr = runnableExpressionKinds.has(this.__kind__)
        ? this
        : (_a = wrappedExprCache.get(this)) !== null && _a !== void 0 ? _a : wrappedExprCache.set(this, select(this)).get(this);
    const _args = jsonifyComplexParams(expr, args);
    if (expr.__cardinality__ === Cardinality.One ||
        expr.__cardinality__ === Cardinality.AtMostOne) {
        return cxn.querySingleJSON(expr.toEdgeQL(), _args);
    }
    else {
        return cxn.queryJSON(expr.toEdgeQL(), _args);
    }
}
