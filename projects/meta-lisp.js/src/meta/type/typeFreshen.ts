import * as M from "../index.ts"
import { recordMapValue } from "@xieyuheng/helpers.js/record"

export function typeFreshen(type: M.Value): M.Value {
  if (M.isVarType(type)) {
    return type
  }

  if (M.isCanonicalLabelType(type)) {
    return type
  }

  if (M.isTypeType(type)) {
    return type
  }

  if (M.isLiteralType(type)) {
    return type
  }

  if (M.isAtomType(type)) {
    return type
  }

  if (M.isTauType(type)) {
    return M.createTauType(
      M.tauTypeElementTypes(type).map((t) => typeFreshen(t)),
    )
  }

  if (M.isInterfaceType(type)) {
    return M.createInterfaceType(
      recordMapValue(M.interfaceTypeAttributeTypes(type), (t) =>
        typeFreshen(t),
      ),
    )
  }

  if (M.isExtendInterfaceType(type)) {
    return M.createExtendInterfaceType(
      typeFreshen(M.extendInterfaceTypeBaseType(type)),
      recordMapValue(M.extendInterfaceTypeAttributeTypes(type), (t) =>
        typeFreshen(t),
      ),
    )
  }

  if (M.isArrowType(type)) {
    return M.createArrowType(
      M.arrowTypeArgTypes(type).map((t) => typeFreshen(t)),
      typeFreshen(M.arrowTypeRetType(type)),
    )
  }

  if (M.isListType(type)) {
    return M.createListType(typeFreshen(M.listTypeElementType(type)))
  }

  if (M.isSetType(type)) {
    return M.createSetType(typeFreshen(M.setTypeElementType(type)))
  }

  if (M.isHashType(type)) {
    return M.createHashType(
      typeFreshen(M.hashTypeKeyType(type)),
      typeFreshen(M.hashTypeValueType(type)),
    )
  }

  if (M.isDefinedDataType(type)) {
    return M.createDefinedDataType(
      M.definedDataTypeDefinition(type),
      M.definedDataTypeArgTypes(type).map((t) => typeFreshen(t)),
    )
  }

  if (M.isDefinedInterfaceType(type)) {
    return M.createDefinedInterfaceType(
      M.definedInterfaceTypeDefinition(type),
      M.definedInterfaceTypeArgTypes(type).map((t) => typeFreshen(t)),
    )
  }

  if (M.isSumType(type)) {
    return M.createSumType(
      recordMapValue(M.sumTypeVariantTypes(type), (t) => typeFreshen(t)),
    )
  }

  if (M.isPolymorphicType(type)) {
    return typeFreshen(M.polymorphicTypeFreshBodyType(type))
  }

  let message = `[typeFreshen] unhandled type`
  message += `\n  type: ${M.formatType(type)}`
  throw new Error(message)
}
