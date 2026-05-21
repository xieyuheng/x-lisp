import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function LocatePass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      locateDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "090-locate")
}

function locateDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
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

function locateSpecialApply(exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "ApplyExp": {
      if (matchLocateEntry(exp.target, exp.args)) {
        if (!exp.location) {
          let message = `[locateSpecialApply] expect source location`
          message += `\n  exp: ${M.formatExp(exp)}`
          throw new Error(message)
        }

        return M.ApplyExp(
          targetWithLocation(exp.target),
          [
            ...exp.args.map((e) => locateSpecialApply(e)),
            expFromSourceLocation(exp.location),
          ],
          exp.location,
        )
      } else {
        return M.ApplyExp(
          exp.target,
          exp.args.map((e) => locateSpecialApply(e)),
          exp.location,
        )
      }
    }

    default: {
      return M.expTraverse((child) => locateSpecialApply(child), exp)
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

function matchLocateEntry(exp: M.Exp, args: M.Exp[]): boolean {
  if (exp.kind !== "QualifiedVarExp") return false
  if (exp.modName !== "builtin") return false
  const entry = locateTable.find((entry) => entry.source === exp.name)
  if (entry === undefined) return false
  return args.length === entry.sourceArity
}

function targetWithLocation(exp: M.Exp): M.Exp {
  assert(exp.kind === "QualifiedVarExp")
  const entry = findLocateEntry(exp.name)
  return M.QualifiedVarExp(exp.modName, entry.target, exp.location)
}

function expFromSourceLocation(location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.SymbolExp("make-source-location", location),
      M.StringExp(location.path, location),
      expFromSpan(location.span, location),
    ],
    location,
  )
}

function expFromSpan(span: S.Span, location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.SymbolExp("make-source-span", location),
      expFromPosition(span.start, location),
      expFromPosition(span.end, location),
    ],
    location,
  )
}

function expFromPosition(
  position: S.Position,
  location: S.SourceLocation,
): M.Exp {
  return M.desugarList(
    [
      M.SymbolExp("make-source-position", location),
      M.IntExp(BigInt(position.index), location),
      M.IntExp(BigInt(position.row), location),
      M.IntExp(BigInt(position.column), location),
    ],
    location,
  )
}
