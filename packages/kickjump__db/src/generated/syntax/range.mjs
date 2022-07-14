import { Range } from "edgedb";
import { TypeKind, ExpressionKind, } from "edgedb/dist/reflection/index.js";
import { literalToTypeSet } from "../castMaps.mjs";
import { spec } from "../__spec__.mjs";
import { literal, $nameMapping } from "./literal.mjs";
import { $resolveOverload } from "./funcops.mjs";
import { $expressionify } from "./path.mjs";
function range(...args) {
    var _a;
    if (args.length === 1) {
        const arg = args[0];
        if (arg instanceof Range) {
            return literal(range(literalToTypeSet((_a = arg.lower) !== null && _a !== void 0 ? _a : arg.upper).__element__), arg);
        }
        if (arg.__kind__ && !arg.__element__) {
            return {
                __kind__: TypeKind.range,
                __name__: `range<${arg.__name__}>`,
                __element__: arg,
            };
        }
    }
    const { returnType, cardinality, args: positionalArgs, namedArgs, } = $resolveOverload("std::range", args, spec, [
        {
            args: [
                {
                    typeId: $nameMapping.get("std::anypoint"),
                    optional: true,
                    setoftype: false,
                    variadic: false,
                },
                {
                    typeId: $nameMapping.get("std::anypoint"),
                    optional: true,
                    setoftype: false,
                    variadic: false,
                },
            ],
            namedArgs: {
                inc_lower: {
                    typeId: $nameMapping.get("std::bool"),
                    optional: true,
                    setoftype: false,
                    variadic: false,
                },
                inc_upper: {
                    typeId: $nameMapping.get("std::bool"),
                    optional: true,
                    setoftype: false,
                    variadic: false,
                },
                empty: {
                    typeId: $nameMapping.get("std::bool"),
                    optional: true,
                    setoftype: false,
                    variadic: false,
                },
            },
            returnTypeId: $nameMapping.get("range<std::anypoint>"),
        },
    ]);
    return $expressionify({
        __kind__: ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
export { range as $range };