import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as L from "../index.ts"

export function typeFreshen(type: L.Value): L.Value {
  if (L.isVarType(type)) {
    return type
  }

  if (L.isCanonicalLabelType(type)) {
    return type
  }

  if (L.isTypeType(type)) {
    return type
  }

  if (L.isLiteralType(type)) {
    return type
  }

  if (L.isAtomType(type)) {
    return type
  }

  if (L.isTauType(type)) {
    return L.createTauType(
      L.tauTypeElementTypes(type).map((t) => typeFreshen(t)),
    )
  }

  if (L.isInterfaceType(type)) {
    return L.createInterfaceType(
      recordMapValue(L.interfaceTypeAttributeTypes(type), (t) =>
        typeFreshen(t),
      ),
    )
  }

  if (L.isExtendInterfaceType(type)) {
    return L.createExtendInterfaceType(
      typeFreshen(L.extendInterfaceTypeBaseType(type)),
      recordMapValue(L.extendInterfaceTypeAttributeTypes(type), (t) =>
        typeFreshen(t),
      ),
    )
  }

  if (L.isArrowType(type)) {
    return L.createArrowType(
      L.arrowTypeArgTypes(type).map((t) => typeFreshen(t)),
      typeFreshen(L.arrowTypeRetType(type)),
    )
  }

  if (L.isListType(type)) {
    return L.createListType(typeFreshen(L.listTypeElementType(type)))
  }

  if (L.isSetType(type)) {
    return L.createSetType(typeFreshen(L.setTypeElementType(type)))
  }

  if (L.isHashType(type)) {
    return L.createHashType(
      typeFreshen(L.hashTypeKeyType(type)),
      typeFreshen(L.hashTypeValueType(type)),
    )
  }

  if (L.isDefinedDataType(type)) {
    return L.createDefinedDataType(
      L.definedDataTypeDefinition(type),
      L.definedDataTypeArgTypes(type).map((t) => typeFreshen(t)),
    )
  }

  if (L.isDefinedInterfaceType(type)) {
    return L.createDefinedInterfaceType(
      L.definedInterfaceTypeDefinition(type),
      L.definedInterfaceTypeArgTypes(type).map((t) => typeFreshen(t)),
    )
  }

  if (L.isSumType(type)) {
    return L.createSumType(
      recordMapValue(L.sumTypeVariantTypes(type), (t) => typeFreshen(t)),
    )
  }

  if (L.isPolymorphicType(type)) {
    return typeFreshen(L.polymorphicTypeFreshBodyType(type))
  }

  let message = `[typeFreshen] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
