import { ExpressionKind, } from "edgedb/dist/reflection/index.js";
import { $expressionify } from "./path.mjs";
export function makeGlobal(name, type, card) {
    return $expressionify({
        __name__: name,
        __element__: type,
        __cardinality__: card,
        __kind__: ExpressionKind.Global,
    });
}
