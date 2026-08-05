import * as M from "../../meta/index.ts"
import { desugarLocationZh } from "../desugar/desugarLocationZh.ts"

export function LocatePass(pkg: M.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      locateDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "110-locate")
}

function locateDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "VariableDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "TestDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "TypeDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "AlgebraicTypeDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields, location }) => ({
          mod: definition.mod,
          typeName: definition.name,
          name,
          fields: fields.map(({ name, type, location }) => ({
            name,
            type: locateSpecialApply(type),
            location,
          })),
          location,
        }),
      )

      return null
    }

    case "OpaqueTypeDefinition": {
      definition.representationType = locateSpecialApply(
        definition.representationType,
      )

      definition.interfaceEntries = definition.interfaceEntries.map(
        ({ name, type, location }) => ({
          name,
          type: locateSpecialApply(type),
          location,
        }),
      )

      return null
    }
  }
}

function locateSpecialApply(term: M.Term): M.Term {
  switch (term.kind) {
    case "ApplyTerm": {
      if (matchLocateEntry(term.target, term.args)) {
        if (!term.location) {
          let message = `[locateSpecialApply] termect source location`
          message += `\n  term: ${M.formatTerm(term)}`
          throw new Error(message)
        }

        return M.ApplyTerm(
          targetWithLocation(term.target),
          [
            ...term.args.map((e) => locateSpecialApply(e)),
            term.target.modName === "内置"
              ? M.desugar(desugarLocationZh(term.location))
              : M.desugar(M.desugarLocation(term.location)),
          ],
          term.location,
        )
      } else {
        return M.ApplyTerm(
          term.target,
          term.args.map((e) => locateSpecialApply(e)),
          term.location,
        )
      }
    }

    default: {
      return M.termTraverse((child) => locateSpecialApply(child), term)
    }
  }
}

// prettier-ignore
const locateTable: Array<{
  modName: string
  source: string
  sourceArity: number
  target: string
}> = [
  { modName: "builtin", source: "error", sourceArity: 1, target: "error-with-location" },
  { modName: "builtin", source: "assert", sourceArity: 1, target: "assert-with-location" },
  { modName: "builtin", source: "assert-not", sourceArity: 1, target: "assert-not-with-location" },
  { modName: "builtin", source: "assert-not-equal", sourceArity: 2, target: "assert-not-equal-with-location" },
  { modName: "builtin", source: "assert-equal", sourceArity: 2, target: "assert-equal-with-location" },
  { modName: "builtin", source: "box-get", sourceArity: 1, target: "box-get-with-location" },
  { modName: "内置", source: "报错", sourceArity: 1, target: "定位报错" },
  { modName: "内置", source: "断言", sourceArity: 1, target: "定位断言" },
  { modName: "内置", source: "断言非", sourceArity: 1, target: "定位断言非" },
  { modName: "内置", source: "断言不等", sourceArity: 2, target: "定位断言不等" },
  { modName: "内置", source: "断言相等", sourceArity: 2, target: "定位断言相等" },
  { modName: "内置", source: "匣子取", sourceArity: 1, target: "匣子定位取" },
]

function findLocateEntry(
  modName: string,
  name: string,
): {
  modName: string
  source: string
  sourceArity: number
  target: string
} {
  const entry = locateTable.find(
    (entry) => entry.modName === modName && entry.source === name,
  )
  if (entry === undefined) {
    throw new Error(`[findLocateEntry] unknown source: ${modName}/${name}`)
  }

  return entry
}

function matchLocateEntry(
  term: M.Term,
  args: M.Term[],
): term is M.QualifiedVarTerm {
  if (term.kind !== "QualifiedVarTerm") return false
  const entry = locateTable.find(
    (entry) => entry.modName === term.modName && entry.source === term.name,
  )
  if (entry === undefined) return false
  return args.length === entry.sourceArity
}

function targetWithLocation(term: M.QualifiedVarTerm): M.Term {
  const entry = findLocateEntry(term.modName, term.name)
  return M.QualifiedVarTerm(
    term.pkgName,
    term.modName,
    entry.target,
    term.location,
  )
}
