import assert from "node:assert"
import * as M from "../../meta/index.ts"

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
            M.desugar(M.desugarLocation(term.location)),
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

const locateTable: Array<{
  source: string
  sourceArity: number
  target: string
}> = [
  { source: "error", sourceArity: 1, target: "error-with-location" },
  { source: "assert", sourceArity: 1, target: "assert-with-location" },
  { source: "assert-not", sourceArity: 1, target: "assert-not-with-location" },
  {
    source: "assert-not-equal",
    sourceArity: 2,
    target: "assert-not-equal-with-location",
  },
  {
    source: "assert-equal",
    sourceArity: 2,
    target: "assert-equal-with-location",
  },
  { source: "box-get", sourceArity: 1, target: "box-get-with-location" },
]

function findLocateEntry(name: string): {
  source: string
  sourceArity: number
  target: string
} {
  const entry = locateTable.find((entry) => entry.source === name)
  if (entry === undefined) {
    throw new Error(`[findLocateEntry] unknown source: ${name}`)
  }

  return entry
}

function matchLocateEntry(term: M.Term, args: M.Term[]): boolean {
  if (term.kind !== "QualifiedVarTerm") return false
  if (term.modName !== "builtin") return false
  const entry = locateTable.find((entry) => entry.source === term.name)
  if (entry === undefined) return false
  return args.length === entry.sourceArity
}

function targetWithLocation(term: M.Term): M.Term {
  assert(term.kind === "QualifiedVarTerm")
  const entry = findLocateEntry(term.name)
  return M.QualifiedVarTerm(
    term.pkgName,
    term.modName,
    entry.target,
    term.location,
  )
}
