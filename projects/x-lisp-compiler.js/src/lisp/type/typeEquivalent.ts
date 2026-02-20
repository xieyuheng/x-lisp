import { arrayZip } from "@xieyuheng/helpers.js/array"
import assert from "node:assert"
import * as L from "../index.ts"

export type Trail = Array<[L.Value, L.Value]>

function typeOccurred(trail: Trail, lhs: L.Value, rhs: L.Value): boolean {
  for (const entry of trail) {
    if (L.equal(entry[0], lhs) && L.equal(entry[1], rhs)) return true
    if (L.equal(entry[0], rhs) && L.equal(entry[1], lhs)) return true
  }

  return false
}

export function typeEquivalent(trail: Trail, lhs: L.Value, rhs: L.Value): void {
  if (typeOccurred(trail, lhs, rhs)) {
    return
  }

  if (
    lhs.kind === "TaelValue" &&
    rhs.kind === "TaelValue" &&
    sexpHasHead(lhs, L.HashtagValue("tau")) &&
    sexpHasHead(rhs, L.HashtagValue("tau"))
  ) {
    typeEquivalentMany(trail, lhs.elements, rhs.elements)
    typeEquivalentManyAttributes(trail, lhs.attributes, rhs.attributes)
    return
  }

  if (lhs.kind === "DatatypeValue" && rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]
    typeEquivalent(trail, unfoldDatatypeValue(lhs), unfoldDatatypeValue(rhs))
    return
  }

  if (lhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]
    typeEquivalent(trail, unfoldDatatypeValue(lhs), rhs)
    return
  }

  if (rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]
    typeEquivalent(trail, lhs, unfoldDatatypeValue(rhs))
    return
  }

  if (lhs.kind === "DisjointUnionValue" && rhs.kind === "DisjointUnionValue") {
    typeEquivalentManyAttributes(trail, lhs.types, rhs.types)
    return
  }

  if (!L.equal(lhs, rhs)) {
    let message = `[typeEquivalent] fail`
    message += `\n  lhs: ${L.formatValue(lhs)}`
    message += `\n  rhs: ${L.formatValue(rhs)}`
    throw new Error(message)
  }
}

function typeEquivalentMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): void {
  assert(lhs.length === rhs.length)
  arrayZip(lhs, rhs).forEach(([l, r]) => typeEquivalent(trail, l, r))
}

function typeEquivalentManyAttributes(
  trail: Trail,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): void {
  const leftValues = Object.values(lhs)
  const rightValues = Object.values(rhs)
  if (leftValues.length !== rightValues.length) {
    assert(false)
  }

  for (const k of Object.keys(lhs)) {
    const l = lhs[k]
    const r = rhs[k]

    typeEquivalent(trail, l, r)
  }
}

export function sexpHasHead(sexp: L.Value, head: L.Value): boolean {
  if (sexp.kind !== "TaelValue") return false
  const { elements } = L.asTaelValue(sexp)
  if (elements.length < 1) return false
  if (!L.equal(elements[0], head)) return false
  return true
}

export function unfoldDatatypeValue(
  datatype: L.DatatypeValue,
): L.DisjointUnionValue {
  const env = L.envPutMany(
    L.emptyEnv(),
    datatype.definition.datatypeConstructor.parameters,
    datatype.args,
  )
  const types: Record<string, L.Value> = {}
  for (const dataConstructor of datatype.definition.dataConstructors) {
    const elementTypes = dataConstructor.fields.map((field) =>
      L.resultValue(L.evaluate(datatype.definition.mod, env, field.type)),
    )

    types[dataConstructor.name] = L.TaelValue(
      [
        L.HashtagValue("tau"),
        L.HashtagValue(dataConstructor.name),
        ...elementTypes,
      ],
      {},
    )
  }

  return L.DisjointUnionValue(types)
}
