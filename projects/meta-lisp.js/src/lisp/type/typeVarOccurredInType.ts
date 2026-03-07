import * as L from "../index.ts";


export function typeVarOccurredInType(varType: L.Value, type: L.Value): boolean {
    if (L.isVarType(type)) {
        return L.varTypeId(type) === L.varTypeId(varType);
    }

    return L.typeChildren(type).some((child) => typeVarOccurredInType(varType, child));
}
