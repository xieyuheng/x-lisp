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

  if (options.dump) projectDumpMods(project, "040-locate")
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
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: locateSpecialApply(type),
          })),
        }),
      )

      return null
    }
  }
}

function locateSpecialApply(exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Apply": {
      if (matchLocateEntry(exp.target, exp.args)) {
        if (!exp.location) {
          let message = `[locateSpecialApply] expect source location`
          message += `\n  exp: ${M.formatExp(exp)}`
          throw new Error(message)
        }

        return M.Apply(
          targetWithLocation(exp.target),
          [
            ...exp.args.map((e) => locateSpecialApply(e)),
            expFromSourceLocation(exp.location),
          ],
          exp.location,
        )
      } else {
        return M.Apply(
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
  if (exp.kind !== "QualifiedVar") return false
  if (exp.modName !== "builtin") return false
  const entry = locateTable.find((entry) => entry.source === exp.name)
  if (entry === undefined) return false
  return args.length === entry.sourceArity
}

function targetWithLocation(exp: M.Exp): M.Exp {
  assert(exp.kind === "QualifiedVar")
  const entry = findLocateEntry(exp.name)
  return M.QualifiedVar(exp.modName, entry.target, exp.location)
}

function expFromSourceLocation(location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.Symbol("make-source-location"),
      M.String(location.path, location),
      expFromSpan(location.span, location),
    ],
    location,
  )
}

function expFromSpan(span: S.Span, location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.Symbol("make-source-span"),
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
      M.Symbol("make-source-position"),
      M.Int(BigInt(position.index), location),
      M.Int(BigInt(position.row), location),
      M.Int(BigInt(position.column), location),
    ],
    location,
  )
}
